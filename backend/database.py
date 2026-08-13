from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Onde o arquivo do banco de dados SQLite vai ser salvo
SQLALCHEMY_DATABASE_URL = "sqlite:///./finance.db"

# 2. O "motor" (engine) que vai fazer a conexão com o banco
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    # O parâmetro abaixo é necessário apenas para o SQLite para evitar problemas de threads
    connect_args={"check_same_thread": False}
)

# 3. Sessões (SessionLocal). 
# Abrir e fechar conexões para salvar ou buscar dados.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. A classe Base. Todas as tabelas que criarmos no futuro vão herdar dela.
Base = declarative_base()


# 5. Função utilitária para abrir e fechar a conexão com o banco de forma segura
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
