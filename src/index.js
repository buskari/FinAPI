const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());

const customers = [];

app.post('/account', (request, response) => {
  const { cpf, name } = request.body;
  const customerAlreadyExists = customers.some(customer => customer.cpf === cpf); // verificar existencia de cpf

  if (customerAlreadyExists)
    return response.status(400).json({ error: "Customer already exists!" });

  customers.push({
    cpf,
    name,
    id: uuidv4(), // Criação do ID através da v4 (utilizando números randômicos)
    statement: []
  });

  return response.status(201).send();
});

// Busca de extrato do cliente
app.get('/statement/:cpf', (request, response) => {
  // para fazer a busca é necessário saber qual o cliente, portanto, necessário fornecer o cpf através dos route params
  const { cpf } = request.params;
  const customer = customers.find(customer => customer.cpf === cpf);

  return response.json(customer.statement);
});

app.listen(3000, () => {
  console.log('Server is up!');
})