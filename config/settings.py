import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
GEMINI_MODEL = os.getenv('GEMINI_MODEL', 'gemini-2.5-flash-lite')

DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
ENV = os.getenv('FLASK_ENV', 'production')
SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

def validate():
    if not GOOGLE_API_KEY:
        raise ValueError(
            "GOOGLE_API_KEY não encontrada!\n"
        )

    if DEBUG and ENV == 'production':
        raise ValueError(
            "DEBUG não pode estar ativado em produção!\n"
            "Configure FLASK_DEBUG=False no .env"
        )

