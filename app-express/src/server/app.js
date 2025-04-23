const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const api_endpoints = require('../api');
const app = express();

let transactions = [];
let accounts = {};

app.use(cors());
app.use(bodyParser.json());

app.post("/transactions", (req, res) => {
  const {amount, account_id} = req.body;

  const transaction_id = generateRandomId();

  const transaction = {
    transaction_id,
    account_id,
    amount
  };

  transactions.push(transaction);

  if (!accounts[account_id]) {
    accounts[account_id] = {
      account_id,
      balance: 0
    };
  }

  accounts[account_id].balance += amount;

  res.status(201).json({transaction_id});
});

app.get("/transactions/:id", (req, res) => {
  const {id} = req.params;
  const transaction = transactions.find(t => t.transaction_id === id);

  if (!transaction) {
    return res.status(404).send("Transaction not found");
  }

  res.status(200).json(transaction);
});

app.get("/accounts/:id", (req, res) => {
  const {id} = req.params;
  
  if (!accounts[id]) {
    accounts[id] = {
      account_id: id,
      balance: 0
    };
  }

  res.status(200).json(accounts[id]);
});

function generateRandomId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

app.use('/', does_method_exist, api_endpoints);

app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

function does_method_exist(req, res, next) {
  next();
}


module.exports = app;
