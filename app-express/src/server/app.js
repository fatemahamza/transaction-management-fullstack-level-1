const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const api_endpoints = require('../api');
const app = express();

let transactions = [];
let accounts = [
  {
    account_id: 1,
    balance: 0
  }
];

app.use(cors());
app.use(bodyParser.json());

app.post("/transactions", (req, res) => {
  const {amount, account_id} = req.body;

  const acount = accounts.find(acc => acc.account_id === account_id);
  if (!acount) {
    return res.status(404).send("Account not found");
  }

  const transactionId = generateRandomId();
  const transaction = {transaction_id: transactionId, account_id, amount};

  transactions.push(transaction);

  acount.balance += amount;

  res.status(201).json(transaction);

});

app.get("/transaction/:id", (req, res) => {
  const {id} = req.params;
  const transaction = transactions.find(t => t.transaction_id === id);

  if (!transaction) {
    return res.status(404).send("Transaction not found");
  }

  res.status(200).json(transaction);
});

app.get("/accounts/:id", (req, res) => {
  const {id} = req.params;
  const account = accounts.find(acc => acc.account_id === parseInt(id));

  if (!account) {
    return res.status(404).send("Account not found");
  }

  res.status(200).json(account);
});

function generateRandomId() {
  return Math.floor(Math.random()*1000000);
}

app.use('/', does_method_exist, api_endpoints);

app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

function does_method_exist(req, res, next) {
  next();
}


module.exports = app;
