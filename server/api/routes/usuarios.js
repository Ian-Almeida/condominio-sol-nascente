const express = require('express');
const router = express.Router();
const db = require('../../database/deps')

router.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try { 
        let query = `SELECT * FROM usuarios WHERE email = '${email}';`;
        let result = await db.execute(query);

        if(!result) {
            res.status(404).send('Usuário não encontrado!');
        }

        query = `SELECT * FROM usuarios WHERE email = '${email}' AND senha = '${senha}';`;
        result = await db.execute(query);

        if(!result) {
            res.status(404).send('Senha inválida!');
        }

        res.send(db.fetchOne(result))

    } catch (err) {
        console.log(err)
    }

});

router.post('/signup', async(req, res) => {
    const { body } = req;
    
    try {
        console.log(body.funcao_select.length)
        console.log(['Zelador', 'Porteiro'].includes(body.funcao_select))
        let query = `SELECT * FROM usuarios WHERE email = '${body.email}';`;
        let params = [];
        let result = await db.execute(query);

        if(result) {
            res.status(404).send('Usuário já cadastrado!');
        }

        if(body.funcao_select === 'Morador') {
            console.log('entrou1')
            query = `INSERT INTO usuarios (nome, cpf, email, senha, telefone_celular, telefone_fixo, condominio_id, bloco, apartamento, funcao, salao_festas_id)
                VALUES (?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?)
             `
            params = [
                body.nome, 
                body.cpf, 
                body.email, 
                body.senha, 
                `${body.prefix_celphone}${body.celphone}`,
                `${body.prefix_phone}${body.phone}`, 
                Number(body.condominio), 
                body.bloco, 
                body.apartamento, 
                body.funcao_select, 
                Number(body.salao_festas_id)
            ];
        } else if(['Zelador', 'Porteiro'].includes(body.funcao_select)) {

            params = [
                Number(body.condominio), 
                body.nome, 
                body.cpf, 
                body.turno,
                body.funcao_select,
                body.salario,
                body.endereco,
            ];

            query = `INSERT INTO funcionarios (codigo_condominio, nome, cpf, turno, funcao, salario, endereco_completo)
                VALUES (?, ?, ?, ? , ?, ?, ?)
            `

            result = await db.execute(query, params);
            if(!result) {
                res.status(404).send('Não foi possível registrar funcionário!');
            }

            query = `INSERT INTO usuarios (nome, cpf, email, senha, telefone_celular, telefone_fixo, condominio_id, funcao, salao_festas_id)
                VALUES (?, ?, ?, ? , ?, ?, ?, ?, ?)
            `

            params = [
                body.nome, 
                body.cpf, 
                body.email, 
                body.senha, 
                `${body.prefix_celphone}${body.celphone}`,
                `${body.prefix_phone}${body.phone}`, 
                Number(body.condominio), 
                body.funcao_select, 
                Number(body.salao_festas_id)
            ];
        }

        result = await db.execute(query, params);
        if(!result) {
            res.status(404).send('Não foi possível registrar usuário!');
        }

        res.send(result)

    } catch (err) {
        console.log(err);
    }
})

module.exports = router;
