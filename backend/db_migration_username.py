from sqlalchemy import create_engine, text
from app.core.config import settings

def migrate_users_table():
    print(f"Connecting to {settings.DATABASE_URL}...")
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as connection:
        try:
            # Check if username exists
            result = connection.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='users' AND column_name='username';"))
            if result.fetchone():
                print("Column 'username' already exists in 'users' table.")
                return

            print("Adding 'username' column to 'users' table...")
            connection.execute(text("ALTER TABLE users ADD COLUMN username VARCHAR;"))
            connection.execute(text("CREATE UNIQUE INDEX ix_users_username ON users (username);"))
            
            connection.commit()
            print("Migration successful: Added username column to users table.")
        except Exception as e:
            print(f"Migration failed: {e}") 

if __name__ == "__main__":
    migrate_users_table()
