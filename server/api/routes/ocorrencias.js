const express = require('express');
const router = express.Router();
const db = require('../../database/deps');

router.put('/', async (req, res) => {
  const { body } = req;
  console.log(body)
  try {
    const query = `
    UPDATE 
      ocorrencias 
    SET 
      codigo_condominio = ${body.codigo_condominio}, 
      codigo_usuario = ${body.codigo_usuario}, 
      categoria = '${body.categoria}', 
      descricao_completa = '${body.descricao_completa}'
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

router.post('/', async (req, res) => {
  const { body } = req;

  try {
    let query = `INSERT INTO ocorrencias (codigo_condominio, codigo_usuario, categoria, descricao_completa)
      VALUES (?, ?, ?, ?)
    `;
    const params = [body.codigo_condominio, body.codigo_usuario, body.categoria, body.descricao_completa];
    let ocorrencia = await db.execute(query, params);

    if(!ocorrencia) {
      res.status(404).send('Erro ao registrar Ocorrência!');
    }

    res.send(ocorrencia);
  } catch (err) {
    console.log(err);
  }
})

router.get('/:condominioId', async (req, res) => {
  const { params } = req;

  try {
    let query = `
      SELECT 
        ocorrencias.*,
        c.nome_condominio 
      FROM 
        ocorrencias
        LEFT JOIN condominios c on c.id = ocorrencias.codigo_condominio
      WHERE 
        ocorrencias.codigo_condominio = ${params.condominioId}`;
    let ocorrencias = await db.execute(query);

    if(!ocorrencias) {
      res.status(404).send('Ocorrências desse condomínio não encontrado!');
    }

    res.send(ocorrencias);
  } catch (err) {
    console.log(err);
  }
})

router.delete('/:id', async (req, res) => {
  const { params } = req;

  try {
    const query = `DELETE FROM ocorrencias WHERE id = ${params.id}`;
    const result = await db.execute(query);

    if(!result) {
      res.status(405).send('Erro ao deletar Ocorrência');
    }

    res.send(result);
  } catch (err) {
    console.log(err);
  }
})

module.exports = router;
