import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [accountId, setAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [transactions, setTransaction] = useState([]);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({account_id: accountId, amount: Number(amount)}), 
      });

      if (!response.ok) {
        throw new Error('Failed to create transaction');
      }

      const data = await response.json();

      const accountResponse = await fetch(`${API_URL}/accounts/${accountId}`);
      const accountData = await accountResponse.json();

      const newTransaction = {
        transaction_id: data.transaction_id,
        account_id: accountId,
        amount: Number(amount),
        balance: accountData.balance
      };

      setTransaction([newTransaction, ...transactions]);

      setAccountId('');
      setAmount('');

    } catch(err) {
      setError(err.message);
      console.error('Error: ', err);
    }
  };

  return (
    <div className="App">
      <h1>Transaction Managment</h1>

      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Account ID: </label>
          <input 
            type='text'
            data-type='account-id'
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            required
          />
        </div>

        <div className='form-group'>
          <label>Amount:</label>
          <input
            type='number'
            data-type='amount'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <button
          type='submit'
          data-type='transaction-submit'
        > Submit Transaction </button>

      </form>

      {error && <div className='error'>{error}</div>}

      <h2>Transaction History</h2>
      <div className='transaction-list'>
        {transactions.map((tx) => (
          <div
             key={tx.transaction_id}
            className="transaction"
            data-type="transaction"
            data-account-id={tx.account_id}
            data-amount={tx.amount}
            data-balance={tx.balance}
          >
            <div>Account: {tx.account_id}</div>
            <div>Amount: {tx.amount}</div>
            <div>Balance: {tx.balance}</div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default App;