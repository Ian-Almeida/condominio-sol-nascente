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

router.put('/', async (req, res) => {
  const { body } = req;

  try {
    const query = `
    UPDATE 
      condominios 
    SET 
      nome_condominio = '${body.nome_condominio}', 
      cnpj = '${body.cnpj}', 
      codigo_salao_festas = ${body.codigo_salao_festas},
      endereco_completo = '${body.endereco_completo}'
    WHERE
      id = ${body.id}
    `;

    const result = await db.execute(query);

    if(!result) {
      res.status(405).send('Erro ao atualizar condominio');
    }

    res.send(result);
  } catch (err) {
    console.log(err);
  }
})

router.post('/', async (req, res) => {
  const { body } = req;

  try {
    let query = `INSERT INTO condominios (nome_condominio, cnpj, endereco_completo, codigo_salao_festas)
      VALUES (?, ?, ?, ?)
    `;
    const params = [body.nome_condominio, body.cnpj, body.endereco_completo, body.codigo_salao_festas];
    let objeto = await db.execute(query, params);

    if(!objeto) {
      res.status(404).send('Erro ao registrar objeto!');
    }

    res.send(objeto);
  } catch (err) {
    console.log(err);
  }
})

router.delete('/:id', async (req, res) => {
  const { params } = req;

  try {
    // 'achados_perdidos, ocorrencias, reservas, funcionarios, usuarios, condominios'
    let query = `DELETE FROM achados_perdidos WHERE codigo_condominio = ${params.id}`;
    await db.execute(query);

    query = `DELETE FROM ocorrencias WHERE codigo_condominio = ${params.id}`;
    await db.execute(query);

    query = `DELETE FROM reservas WHERE codigo_condominio = ${params.id}`;
    await db.execute(query);

    query = `DELETE FROM funcionarios WHERE codigo_condominio = ${params.id}`;
    await db.execute(query);

    query = `DELETE FROM usuarios WHERE condominio_id = ${params.id}`;
    await db.execute(query);

    query = `DELETE FROM condominios WHERE id = ${params.id}`;
    const result = await db.execute(query);

    if(!result) {
      res.status(405).send('Erro ao deletar condominio!');
    }

    res.send(result);
  } catch (err) {
    console.log(err);
  }
})

module.exports = router;
