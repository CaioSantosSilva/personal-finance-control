from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
from database import engine, get_db

# Cria fisicamente as tabelas na base de dados SQLite
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Apex Finance Tracker API")

# --- CONFIGURAÇÃO DO CORS ---
# Lista de endereços que têm permissão para acessar a API (o nosso React)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Permite apenas o nosso React
    allow_credentials=True,
    allow_methods=["*"],              # Permite todos os métodos (GET, POST, DELETE, etc.)
    allow_headers=["*"],              # Permite todos os cabeçalhos
)
# -----------------------------

# Rota raiz para testar a comunicação
@app.get("/")
def read_root():
    return {
        "status": "Online",
        "projeto": "Apex Finance Tracker",
        "mensagem": "O seu backend em FastAPI já está a funcionar perfeitamente!"
    }

# Rota para registar uma nova transação
@app.post("/transactions/", response_model=schemas.Transaction, status_code=201)
def create_transaction(transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    db_transaction = models.Transaction(
        description=transaction.description,
        value=transaction.value,
        type=transaction.type,
        category=transaction.category
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

# Rota para listar todas as transações
@app.get("/transactions/", response_model=List[schemas.Transaction])
def read_transactions(db: Session = Depends(get_db)):
    transactions = db.query(models.Transaction).all()
    return transactions

# Rota para apagar uma transação específica
@app.delete("/transactions/{transaction_id}", status_code=204)
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transação não encontrada")
    db.delete(db_transaction)
    db.commit()
    return None