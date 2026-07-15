// src/App.jsx
import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

// URL base da nossa API FastAPI (Backend)
const API_URL = 'http://127.0.0.1:8000/transactions/'

function App() {
  // Estados para controlar os campos do formulário
  const [description, setDescription] = useState('')
  const [value, setValue] = useState('')
  const [type, setType] = useState('receita')
  const [category, setCategory] = useState('Vendas')

  // Lista de transações que virá do banco de dados
  const [transactions, setTransactions] = useState([])

  // 1. Função para buscar as transações da API
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(API_URL)
      setTransactions(response.data) // Atualiza a lista com o que está no banco
    } catch (error) {
      console.error('Erro ao buscar transações:', error)
      alert('Não foi possível carregar as transações do banco de dados.')
    }
  }

  // O useEffect roda essa busca automaticamente toda vez que a página carrega
  useEffect(() => {
    fetchTransactions()
  }, [])

  // 2. Cálculos automáticos baseados nos dados reais do banco
  const totalIncome = transactions
    .filter((t) => t.type === 'receita')
    .reduce((sum, t) => sum + t.value, 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'despesa')
    .reduce((sum, t) => sum + t.value, 0)

  const currentBalance = totalIncome - totalExpense

  // 3. Função para enviar uma nova transação para a API
  const handleAddTransaction = async (e) => {
    e.preventDefault()
    if (!description || !value) return alert('Preencha todos os campos!')

    const newTransaction = {
      description,
      value: parseFloat(value),
      type,
      category
    }

    try {
      // Faz o POST real para a nossa API FastAPI
      await axios.post(API_URL, newTransaction)
      
      // Limpa os campos do formulário após o sucesso
      setDescription('')
      setValue('')
      
      // Recarrega a lista direto do banco para atualizar a tela
      fetchTransactions()
    } catch (error) {
      console.error('Erro ao salvar transação:', error)
      alert('Erro ao salvar no banco de dados.')
    }
  }

  // 4. Função para apagar uma transação
  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Tem certeza que deseja apagar esta transação?')) {
      try {
        await axios.delete(`${API_URL}${id}`)
        fetchTransactions() // Recarrega a lista do banco atualizada
      } catch (error) {
        console.error('Erro ao apagar transação:', error)
        alert('Erro ao apagar do banco de dados.')
      }
    }
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Meu Controle Financeiro</h1>
        <p className="subtitle">Gerencie suas receitas e despesas de forma simples</p>
      </header>

      {/* Seção de Resumo Financeiro (Cards Dinâmicos) */}
      <div className="summary-cards">
        <div className="card income">
          <h3>Receitas</h3>
          <p>R$ {totalIncome.toFixed(2).replace('.', ',')}</p>
        </div>
        <div className="card expense">
          <h3>Despesas</h3>
          <p>R$ {totalExpense.toFixed(2).replace('.', ',')}</p>
        </div>
        <div className="card total">
          <h3>Saldo Atual</h3>
          <p style={{ color: currentBalance >= 0 ? '#10b981' : '#ef4444' }}>
            R$ {currentBalance.toFixed(2).replace('.', ',')}
          </p>
        </div>
      </div>

      <div className="main-content">
        {/* Formulário para adicionar nova transação */}
        <form className="transaction-form" onSubmit={handleAddTransaction}>
          <h2>Nova Transação</h2>
          
          <div className="input-group">
            <label>Descrição</label>
            <input 
              type="text" 
              placeholder="Ex: Venda de mini pastéis" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Valor (R$)</label>
            <input 
              type="number" 
              step="0.01" 
              placeholder="0.00" 
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Tipo</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="receita">Receita (Entrada)</option>
              <option value="despesa">Despesa (Saída)</option>
            </select>
          </div>

          <div className="input-group">
            <label>Categoria</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Vendas">Vendas</option>
              <option value="Insumos">Insumos (Ingredientes)</option>
              <option value="Infraestrutura">Infraestrutura (Gás, Energia)</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <button type="submit" className="btn-submit">Adicionar Transação</button>
        </form>

        {/* Lista de Transações (Extrato Real) */}
        <div className="transactions-list">
          <h2>Extrato Recente</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Valor</th>
                  <th>Tipo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: '#64748b' }}>
                      Nenhuma transação cadastrada ainda.
                    </td>
                  </tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t.id}>
                      <td>{t.description}</td>
                      <td><span className="badge">{t.category}</span></td>
                      <td className={t.type === 'receita' ? 'value-income' : 'value-expense'}>
                        {t.type === 'receita' ? '+' : '-'} R$ {t.value.toFixed(2).replace('.', ',')}
                      </td>
                      <td>
                        <span className={`type-badge ${t.type}`}>
                          {t.type === 'receita' ? 'Receita' : 'Despesa'}
                        </span>
                      </td>
                      <td>
                        <button 
                          onClick={() => handleDeleteTransaction(t.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.85rem'
                          }}
                        >
                          Apagar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App