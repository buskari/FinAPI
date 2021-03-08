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

app.listen(3000, () => {
  console.log('Server is up!');
})