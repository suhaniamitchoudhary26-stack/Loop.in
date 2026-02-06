from fastapi import APIRouter, Depends, HTTPException
import cloudinary
import cloudinary.utils
from datetime import datetime
import time

from app.core.config import settings
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

@router.get("/signature")
async def get_cloudinary_signature(
    current_user: User = Depends(get_current_user)
):
    """
    Generate a signed signature for Cloudinary direct upload from frontend.
    Returns mock=True if Cloudinary is not configured, enabling Local-Dev mode.
    """
    try:
        # Check if configured
        if not settings.CLOUDINARY_API_SECRET or not settings.CLOUDINARY_CLOUD_NAME:
            print("WARNING: Cloudinary not configured. Entering Orbit-Mock Mode.")
            return {
                "mock": True,
                "message": "Cloudinary credentials missing. Running in local simulation mode."
            }

        timestamp = int(time.time())
        
        # Secure parameters
        params = {
            "timestamp": timestamp,
            "folder": "mits_loop_in",
            "context": f"user_id={current_user.id}|author={current_user.username}",
            "upload_preset": "mits_campus_preset"
        }
        
        signature = cloudinary.utils.api_sign_request(
            params, 
            settings.CLOUDINARY_API_SECRET
        )
        
        return {
            "mock": False,
            "signature": signature,
            "timestamp": timestamp,
            "api_key": settings.CLOUDINARY_API_KEY,
            "cloud_name": settings.CLOUDINARY_CLOUD_NAME,
            "folder": params["folder"]
        }
    except Exception as e:
        print(f"CRITICAL ERROR in get_cloudinary_signature: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
