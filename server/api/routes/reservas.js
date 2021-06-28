const express = require('express');
const router = express.Router();
const db = require('../../database/deps');

router.delete('/:id', async (req, res) => {
  const { params } = req;

  try {
    const query = `DELETE FROM reservas WHERE id = ${params.id}`;
    const result = await db.execute(query);

    if(!result) {
      res.status(405).send('Erro ao deletar Reserva');
    }

    res.send(result);
  } catch (err) {
    console.log(err);
  }
})

router.put('/', async (req, res) => {
  const { body } = req;

  try {
    let query = `SELECT * FROM condominios WHERE id = ${body.codigo_condominio}`
    const condominio = db.fetchOne(await db.execute(query));

    query = `
    UPDATE 
      reservas 
    SET 
      codigo_condominio = ${body.codigo_condominio}, 
      codigo_salao_festa = ${condominio.codigo_salao_festas}, 
      data_inicio = '${body.data_inicio}', 
      data_fim = '${body.data_fim}'
    WHERE
      id = ${body.id}
    `;

    const result = await db.execute(query);

    if(!result) {
      res.status(405).send('Erro ao atualizar Reserva');
    }

    res.send(result);
  } catch (err) {
    console.log(err);
  }
})

router.post('/', async (req, res) => {
  const { body } = req;

  try {
    let query = `SELECT * FROM condominios WHERE id = ${body.codigo_condominio}`
    const condominio = db.fetchOne(await db.execute(query));

    query = `INSERT INTO reservas (codigo_condominio, codigo_salao_festa, data_inicio, data_fim)
      VALUES (?, ?, ?, ?)
    `;
    const params = [body.codigo_condominio, condominio.codigo_salao_festas, body.data_inicio, body.data_fim];
    const reservas = await db.execute(query, params);

    if(!reservas) {
      res.status(404).send('Erro ao registrar Reserva!');
    }

    res.send(reservas);
  } catch (err) {
    console.log(err);
  }
})

router.get('/:condominioId', async (req, res) => {
  const { params } = req;

  try {
    let query = `
      SELECT 
        reservas.*,
        c.nome_condominio 
      FROM 
        reservas
        LEFT JOIN condominios c on c.id = reservas.codigo_condominio
      WHERE 
        reservas.codigo_condominio = ${params.condominioId}`;
    let reservas = await db.execute(query);

    if(!reservas) {
      res.status(404).send('Reservas desse condomínio não encontrado!');
    }

    res.send(reservas);
  } catch (err) {
    console.log(err);
  }
})

module.exports = router;
