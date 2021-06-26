const express = require('express');
const router = express.Router();
const db = require('../../database/deps');

router.get('/:condominioId', async (req, res) => {
  const { params } = req;

  try {
    let query = `SELECT * FROM funcionarios WHERE codigo_condominio = ${params.condominioId}`;
    let funcionarios = await db.execute(query);

    if(!funcionarios) {
      res.status(404).send('Funcionários desse condomínio não encontrado!');
    }

    res.send(funcionarios);
  } catch (err) {
    console.log(err);
  }
})

module.exports = router;
