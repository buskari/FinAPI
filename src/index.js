const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json()); // middleware para interpretação de json

// representação de db via array
const customers = [];

// Criação de conta
/**
 * cpf - string
 * name - string
 * id - uuid
 * statement []
 */
app.post('/account', (request, response) => {
  const { cpf, name } = request.body;
  const id = uuidv4(); // Criação do ID através da v4 (utilizando números randômicos)

  // inserção dos dados no array (fake db)
  customers.push({
    cpf,
    name,
    id,
    statement: []
  });

  // confirmação de criação de conta
  return response.status(201).send();
});

app.listen(3000, () => {
  console.log('Server is up!');
})