
import os
import sys

# Add backend to path
sys.path.append(os.getcwd())

from app.core.config import settings
from app.models.user import User
import cloudinary
import cloudinary.utils
import time

def test_signature():
    print("Testing Cloudinary Signature Generation...")
    
    # Mock user
    mock_user = User(id=1, username="testuser", email="test@example.com")
    
    # Configure Cloudinary (mimic media.py)
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET
    )
    
    print(f"Cloud Name: {settings.CLOUDINARY_CLOUD_NAME}")
    print(f"API Key: {settings.CLOUDINARY_API_KEY}")
    print(f"API Secret length: {len(settings.CLOUDINARY_API_SECRET)}")
    
    if not settings.CLOUDINARY_API_SECRET:
        print("FAIL: Cloudinary API Secret is missing")
        return

    timestamp = int(time.time())
    params = {
        "timestamp": timestamp,
        "folder": "mits_loop_in",
        "context": f"user_id={mock_user.id}|author={mock_user.username}",
        "upload_preset": "mits_campus_preset"
    }
    
    try:
        signature = cloudinary.utils.api_sign_request(
            params, 
            settings.CLOUDINARY_API_SECRET
        )
        print(f"SUCCESS: Generated signature: {signature}")
    except Exception as e:
        print(f"FAIL: Error generating signature: {e}")

if __name__ == "__main__":
    test_signature()
