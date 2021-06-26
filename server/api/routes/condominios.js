const express = require('express');
const db = require('../../database/deps')
const router = express.Router();

router.get('/', async (req, res) => {
  const query = 'SELECT * FROM condominios';
  let results = await db.execute(query);
  res.send(results)
});

router.get('/:userId', async (req, res) => {
  const { params } = req;

  let query = `SELECT * FROM usuarios WHERE id = ${params.userId}`;
  let user = db.fetchOne(await db.execute(query));

  if(!user) {
    res.status(404).send('Usuário não encontrado!');
  }

  query = `SELECT * FROM condominios WHERE id = ${user.condominio_id}`;
  condominio = db.fetchOne(await db.execute(query));

  if(!condominio) {
    res.status(404).send('Condomínio não encontrado!');
  }

  res.send(condominio);
  
})

module.exports = router;
