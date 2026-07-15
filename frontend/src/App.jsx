// src/App.jsx
import { useState } from 'react'
import './App.css'

function App() {
  // Estados para controlar os campos do formulário
  const [description, setDescription] = useState('')
  const [value, setValue] = useState('')
  const [type, setType] = useState('receita')
  const [category, setCategory] = useState('Vendas')

  // Lista temporária de transações (depois vamos buscar do banco de dados)
  const [transactions, setTransactions] = useState([
    { id: 1, description: 'Venda de salgados', value: 350.00, type: 'receita', category: 'Vendas' },
    { id: 2, description: 'Compra de farinha', value: 120.50, type: 'despesa', category: 'Insumos' }
  ])

  // Função para simular o cadastro na tela
  const handleAddTransaction = (e) => {
    e.preventDefault()
    if (!description || !value) return alert('Preencha todos os campos!')

    const newTransaction = {
      id: Date.now(),
      description,
      value: parseFloat(value),
      type,
      category
    }

    setTransactions([newTransaction, ...transactions])
    setDescription('')
    setValue('')
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Meu Controle Financeiro</h1>
        <p className="subtitle">Gerencie suas receitas e despesas de forma simples</p>
      </header>

      {/* Seção de Resumo Financeiro (Cards) */}
      <div className="summary-cards">
        <div className="card income">
          <h3>Receitas</h3>
          <p>R$ 350,00</p>
        </div>
        <div className="card expense">
          <h3>Despesas</h3>
          <p>R$ 120,50</p>
        </div>
        <div className="card total">
          <h3>Saldo Atual</h3>
          <p>R$ 229,50</p>
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

        {/* Lista de Transações (Extrato) */}
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
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{t.description}</td>
                    <td><span className="badge">{t.category}</span></td>
                    <td className={t.type === 'receita' ? 'value-income' : 'value-expense'}>
                      {t.type === 'receita' ? '+' : '-'} R$ {t.value.toFixed(2)}
                    </td>
                    <td>
                      <span className={`type-badge ${t.type}`}>
                        {t.type === 'receita' ? 'Receita' : 'Despesa'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App