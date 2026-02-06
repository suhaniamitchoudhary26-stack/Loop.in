from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv("backend/.env")
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

def migrate():
    with engine.connect() as conn:
        print("Adding media columns to 'posts' table...")
        
        try:
            conn.execute(text("ALTER TABLE posts ADD COLUMN media_url VARCHAR;"))
            print("Added media_url")
        except Exception as e:
            print(f"Error adding media_url: {e}")
            
        try:
            conn.execute(text("ALTER TABLE posts ADD COLUMN media_public_id VARCHAR;"))
            print("Added media_public_id")
        except Exception as e:
            print(f"Error adding media_public_id: {e}")
            
        try:
            conn.execute(text("ALTER TABLE posts ADD COLUMN media_type VARCHAR;"))
            print("Added media_type")
        except Exception as e:
            print(f"Error adding media_type: {e}")
            
        conn.commit()
        print("Migration complete!")

if __name__ == "__main__":
    migrate()
