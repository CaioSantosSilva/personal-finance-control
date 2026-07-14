from fastapi import FastAPI

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