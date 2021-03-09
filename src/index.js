const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json()); // middleware para interpretação de json

// representação de db via array
const customers = [];

// Middleware para verificação da existencia de conta
function verifyExistentAccountCPF(request, response, next) {
  const { cpf } = request.headers;
  const customer = customers.find(customer => customer.cpf === cpf);

  if (!customer)
    return response.status(400).send({ error: 'Customer not found!' });

  request.customer = customer;

  return next();
}

function getBalance(statement) {
  return statement.reduce((total, operation) => {
    if (operation.type === 'credit')
      return total + operation.amount;

    return total - operation.amount;
  }, 0)
}

// Criação e verificação de existência de conta
/**
 * cpf - string
 * name - string
 * id - uuid
 * statement []
 */
app.post('/account', (request, response) => {
  const { cpf, name } = request.body;
  const customerAlreadyExists = customers.some(customer => customer.cpf === cpf); // verificar existencia de cpf

  if (customerAlreadyExists)
    return response.status(400).json({ error: "Customer already exists!" });

  // inserção dos dados no array (fake db)
  customers.push({
    cpf,
    name,
    id: uuidv4(), // Criação do ID através da v4 (utilizando números randômicos)
    statement: []
  });

  // confirmação de criação de conta
  return response.status(201).send();
});

// Busca de extrato do cliente
app.get('/statement', verifyExistentAccountCPF, (request, response) => {
  const { customer } = request;

  return response.json(customer.statement);
});

// Efetuação de depósito
app.post('/deposit', verifyExistentAccountCPF, (request, response) => {
  const { description, amount } = request.body;
  const { customer } = request;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: 'credit'
  };

  customer.statement.push(statementOperation);

  return response.status(201).send();
});

// Efetuação de saque
app.post('/withdraw', verifyExistentAccountCPF, (request, response) => {
  const { amount } = request.body;
  const { customer } = request;

  const balance = getBalance(customer.statement);

  // verificação de saldo
  if (amount > balance)
    return response.status(400).send({ error: 'Insufficiente funds!' })

  const statementOperation = {
    amount,
    created_at: new Date(),
    type: 'debit'
  };

  customer.statement.push(statementOperation);
  return response.status(201).send();
});

app.get('/statement/date', verifyExistentAccountCPF, (request, response) => {
  const { customer } = request;
  const { date } = request.query;

  const dateFormat = new Date(date + " 00:00");

  const statement = customer.statement.filter(statement => {
    console.log(statement.created_at.toDateString());
    console.log(dateFormat.toDateString());
    console.log(statement);
    statement.created_at.toDateString() === dateFormat.toDateString();
  });

  console.log(statement);
  return response.json(statement);
});

app.listen(3000, () => {
  console.log('Server is up!');
})