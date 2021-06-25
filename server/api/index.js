const express = require('express')
const morgan = require('morgan');
const router = express.Router()

const achadosPerdidosRouter = require('./routes/achadosPerdidos');
const condominiosRouter = require('./routes/condominios');
const usuariosRouter = require('./routes/usuarios');
const funcionariosRouter = require('./routes/funcionarios');
const ocorrenciasRouter = require('./routes/ocorrencias');
const reservas = require('./routes/reservas');

router.use(morgan('dev'));

router.use('/achadosPerdidos', achadosPerdidosRouter);
router.use('/condominios', condominiosRouter);
router.use('/usuarios', usuariosRouter);
router.use('/funcionarios', funcionariosRouter);
router.use('/ocorrencias', ocorrenciasRouter);
router.use('/reservas', reservas);

module.exports = router;
