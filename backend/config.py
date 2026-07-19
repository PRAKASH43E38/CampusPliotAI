import os
from dotenv import load_dotenv

# Load environment variables from root project dotfiles if they exist
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(root_dir, '.env'))
load_dotenv(os.path.join(root_dir, '.env.local'))

class Config:
    # Use SQLite by default, MySQL if DATABASE_URL is provided in environment
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(os.path.dirname(os.path.abspath(__file__)), 'campus.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Security Keys
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'super-secret-development-key'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key-12345'
    
    # OAuth Configurations
    GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID') or 'mock-google-client-id'
    GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET') or 'mock-google-client-secret'
    
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')
