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
        
        let query = `SELECT * FROM usuarios WHERE email = '${body.email}';`;
        let params = [];
        let result = await db.execute(query);

        if(result.length > 0) {
            res.status(404).send('Usuário já cadastrado!');
            return
        }

        if(body.funcao_select === 'Morador') {
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

            result = await db.execute(query, params);
            if(!result) {
                res.status(404).send('Não foi possível registrar usuário!');
                return
            }

            res.send(result)

        } else if(['Zelador', 'Porteiro'].includes(body.funcao_select)) {

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

            result = await db.execute(query, params);
            if(!result) {
                res.status(404).send('Não foi possível registrar usuário!');
                return
            }

            params = [
                Number(body.condominio), 
                result.insertId,
                body.nome, 
                body.cpf, 
                body.turno,
                body.funcao_select,
                body.salario,
                body.endereco,
            ];

            query = `INSERT INTO funcionarios (codigo_condominio, codigo_usuario, nome, cpf, turno, funcao, salario, endereco_completo)
                VALUES (?, ?, ?, ?, ? , ?, ?, ?)
            `

            result = await db.execute(query, params);
            if(!result) {
                res.status(404).send('Não foi possível registrar funcionário!');
                return
            }
            res.send(result)
        }

    } catch (err) {
        console.log(err);
    }
})

module.exports = router;
