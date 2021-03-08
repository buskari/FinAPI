const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json()); // middleware para interpretação de json

// representação de db via array
const customers = [];

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
app.get('/statement/:cpf', (request, response) => {
  // para fazer a busca é necessário saber qual o cliente, portanto, necessário fornecer o cpf através dos route params
  const { cpf } = request.params;
  const customer = customers.find(customer => customer.cpf === cpf);

  if (!customer)
    return response.status(400).send({ error: 'Customer not found!' });

  return response.json(customer.statement);
});

app.listen(3000, () => {
  console.log('Server is up!');
})