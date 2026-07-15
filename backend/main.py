from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
from database import engine, get_db

#Cria fisicamente as tabelas na base de dados SQLite (finance.db)
models.Base.metadata.create_all(bind=engine)

#Criação da aplicação FastAPI
app= FastAPI(title="Apex Finance Tracker API")

# Criação das rotas 
@app.get("/")
def read_root():
    return {
        "status": "Online",
        "projeto": "Apex Finance Tracker",
        "mensagem": "Backend em FastAPI para o projeto Apex Finance Tracker Esta funcionando"
    }

# Rota para registar uma nova transação (Receita ou Despesa)
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
    db.refresh(db_transaction)  # Atualiza o objeto para obter o ID gerado automaticamente
    return db_transaction

# Rota para listar todas as transações registadas
@app.get("/transactions/", response_model=List[schemas.Transaction])
def read_transactions(db: Session = Depends(get_db)):
    transactions = db.query(models.Transaction).all()
    return transactions

# Rota para apagar uma transação específica através do seu ID
@app.delete("/transactions/{transaction_id}", status_code=204)
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transação não encontrada")
    db.delete(db_transaction)
    db.commit()
    return None