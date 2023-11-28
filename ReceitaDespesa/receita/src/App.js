import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [transactions, setTransactions] = useState(() => {
    const storedTransactions = localStorage.getItem('transactions');
    return storedTransactions ? JSON.parse(storedTransactions) : [];
  });
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [type, setType] = useState('receita');
  const [paymentMethod, setPaymentMethod] = useState('cartão');
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    calculateBalance();
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = () => {
    if (!name || !value || !type || !paymentMethod) {
      alert('Por favor, preencha todos os campos para adicionar uma transação.');
      return;
    }

    const newTransaction = {
      name,
      value: parseFloat(value),
      type,
      paymentMethod,
    };

    setTransactions([...transactions, newTransaction]);

    const tableRows = document.querySelectorAll('.table-row-added');
    tableRows.forEach(row => row.classList.add('table-row-highlight'));
    setTimeout(() => {
      tableRows.forEach(row => row.classList.remove('table-row-highlight'));
    }, 500);

    setName('');
    setValue('');
    setType('receita');
    setPaymentMethod('cartão');
  };

  const handleDeleteTransaction = (index, transactionType) => {
    const updatedTransactions = transactions.filter(
      (transaction, idx) => idx !== index || transaction.type !== transactionType
    );
    setTransactions(updatedTransactions);
  };

  const calculateBalance = () => {
    let totalBalance = 0;
    transactions.forEach((transaction) => {
      if (transaction.type === 'receita') {
        totalBalance += transaction.value;
      } else {
        totalBalance -= transaction.value;
      }
    });
    setBalance(totalBalance);
  };

  const renderCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const renderTable = (transactionType) => {
    const filteredTransactions = transactions.filter(
      (transaction) => transaction.type === transactionType
    );

    return (
      <div>
        <h2>{transactionType === 'receita' ? 'Receitas' : 'Despesas'}</h2>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor</th>
              <th>Tipo</th>
              <th>Pago Por</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction, index) => (
              <tr key={index} className="table-row-added">
                <td>{transaction.name}</td>
                <td>{renderCurrency(transaction.value)}</td>
                <td>{transaction.type}</td>
                <td>{transaction.paymentMethod}</td>
                <td>
                  <button onClick={() => handleDeleteTransaction(index, transactionType)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <h1>Controle Financeiro</h1>
      <div className="app-container">
        <div className="form-container">
          <div>
            <label>Nome:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label>Valor:</label>
            <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
          <div>
            <label>Tipo:</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </select>
          </div>
          <div>
            <label>Pago Por:</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="cartão">Cartão</option>
              <option value="pix">Pix</option>
              <option value="dinheiro">Dinheiro</option>
            </select>
          </div>
          <button className="add-button" onClick={handleAddTransaction}>Enviar</button>
        </div>
        <div className="tables-container">
          <div className="table">{renderTable('receita')}</div>
          <div className="table">{renderTable('despesa')}</div>
        </div>
      </div>
      <div className="current-balance">
        <h2>
          Valor Atual: 
          <span className={balance >= 0 ? 'positive-balance' : 'negative-balance'}>
            {renderCurrency(balance)}
          </span>
        </h2>
      </div>
    </div>
  );
};

export default App;
