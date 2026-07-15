from pydantic import BaseModel

# Esquema para criar uma transação (dados que recebemos do utilizador)
class TransactionCreate(BaseModel):
    description: str
    value: float
    type: str  # Deve ser "receita" ou "despesa"
    category: str

# Esquema completo que representa uma transação salva na base de dados (dados que retornamos)
class Transaction(TransactionCreate):
    id: int

    class Config:
        # Permite que o Pydantic leia diretamente os modelos ORM do SQLAlchemy
        from_attributes = True