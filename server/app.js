const express = require('express');
const bodyParser = require('body-parser');
const initialization = require('./database/initDatabase');
const router = require('./api/index');
const cors = require('cors');

const app = express();
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('base', '/api');
app.use('/api', router);

app.listen(3001, () => {
  try {
    // initialization.init()
    //   .then((resp)=> {
    //     if(resp) {
    //       console.log('DATABASE INITIALIZED WITH SUCCESS');
    //     }
    // });
  } catch (e) {
    console.log(e);
  }
  console.log('Running localhost:3001');
});
