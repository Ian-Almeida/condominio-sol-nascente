const express = require('express');
const router = express.Router();
const db = require('../../database/deps');

router.delete('/:id', async (req, res) => {
  const { params } = req;

  try {

    let query = `SELECT * FROM funcionarios WHERE id = ${params.id}`
    const funcionario = db.fetchOne(await db.execute(query));
    
    query = `DELETE FROM achados_perdidos WHERE codigo_funcionario = ${params.id}`;
    await db.execute(query);

    query = `DELETE FROM funcionarios WHERE id = ${params.id}`;
    await db.execute(query);

    query = `DELETE FROM usuarios WHERE id = ${funcionario.codigo_usuario}`;
    const result = await db.execute(query);

    if(!result) {
      res.status(405).send('Erro ao deletar Funcionário');
    }

    res.send(result);
  } catch (err) {
    console.log(err);
  }
})

router.put('/', async (req, res) => {
  const { body } = req;
  
  try {
    const query = `
    UPDATE funcionarios SET  nome = '${body.nome}',
      turno = '${body.turno}',
      funcao = '${body.funcao}'  WHERE id = ${body.id}
    `;

    const result = await db.execute(query);

    if(!result) {
      res.status(405).send('Erro ao atualizar funcionário');
    }

    res.send(result);
  } catch (err) {
    console.log(err);
  }
})

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
