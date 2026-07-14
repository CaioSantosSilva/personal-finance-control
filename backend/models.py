from sqlalchemy import Column, Integer, String, Float
from database import Base

#Criamos a classe que represntara a nossa tabela de transações
class Transaction(Base):
    __tablename__ = "transactions" # Nome exato da tabela no banco de dados

    # Definimos as colunas da tabela
    id = Column(Integer, primary_key = True, index = True)
    description = Column(String, nullable=False)
    value = Column(Float, nullable=False)
    type = Column(String,nullable=False) # Receita ou despesas
    category = Column(String, nullable=False) # EX:Alimentação Salario