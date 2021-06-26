const express = require('express');
const router = express.Router();
const db = require('../../database/deps');

router.post('/', async (req, res) => {
  const { body } = req;

  try {
    let query = `INSERT INTO achados_perdidos (codigo_condominio, codigo_funcionario, descricao_objeto)
      VALUES (?, ?, ?)
    `;
    const params = [body.codigo_condominio, body.codigo_funcionario, body.descricao];
    let objeto = await db.execute(query, params);

    if(!objeto) {
      res.status(404).send('Erro ao registrar objeto!');
    }

    // query = `SELECT * FROM achados_perdidos WHERE id = ${objeto.insertId}`
    // objeto = db.fetchOne(await db.execute(query, params));

    res.send(objeto);
  } catch (err) {
    console.log(err);
  }
})

router.get('/', async (req, res) => {

  try {
    const query = `SELECT * FROM achados_perdidos`;
    const objetos = await db.execute(query);

    if(!objetos) {
      res.status(404).send('Erro ao procurar objetos!')
    }

    res.send(objetos);

  } catch (err) {
    console.log(err);
  }
})

router.get('/:codigo_condominio', async (req, res) => {
  const { params } = req;

  try {
    const query = `
      SELECT
        achados_perdidos.*,
        f.nome
      FROM
        achados_perdidos
        LEFT JOIN funcionarios f on f.id = achados_perdidos.codigo_funcionario
      WHERE
        achados_perdidos.codigo_condominio =  ${params.codigo_condominio}
    `;
    const objetos = await db.execute(query);

    if(!objetos) {
      res.status(404).send('Erro ao procurar objetos!')
    }

    res.send(objetos);
    
  } catch (err) {
    console.log(err);
  }
})

router.put('/', async (req, res) => {
  const { body } = req;

  try {
    const query = `
    UPDATE 
      achados_perdidos 
    SET 
    codigo_condominio = ${body.codigo_condominio}, codigo_funcionario = ${body.codigo_funcionario}, descricao_objeto = '${body.descricao_objeto}'
    WHERE
      id = ${body.id}
    `;

    const result = await db.execute(query);

    if(!result) {
      res.status(405).send('Erro ao atualizar objeto');
    }

    res.send(result);
  } catch (err) {
    console.log(err);
  }
})

router.delete('/:id', async (req, res) => {
  const { params } = req;

  try {
    const query = `DELETE FROM achados_perdidos WHERE id = ${params.id}`;
    const result = await db.execute(query);

    if(!result) {
      res.status(405).send('Erro ao deletar objeto');
    }

    res.send(result);
  } catch (err) {
    console.log(err);
  }
})

module.exports = router;
