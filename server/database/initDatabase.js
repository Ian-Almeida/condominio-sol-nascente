const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root'
});

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const dropDatabase = async () => {
  let ok = true;
  connection.query('DROP SCHEMA `condominioSolNascente`;', async function(err, rows, fields) {
    if(err) {
      console.log('FAILED DROPPING DATABASE');
      ok = false;
      await sleep(100);
      return;
    }
    console.log('DATABASE DROPPED DUE TO INITIALIZATION FAILURE');
  });
  await sleep(100);
  return ok;
}

const createTables = async () => {

  let ok = true;
  let query = `
      CREATE TABLE condominioSolNascente.condominios (
      id INT AUTO_INCREMENT NOT NULL,
      nome_condominio VARCHAR(255) NOT NULL,
      cnpj VARCHAR(45) NOT NULL,
      endereco_completo VARCHAR(255) NOT NULL,
      codigo_salao_festas INT NOT NULL, 
      PRIMARY KEY (id, codigo_salao_festas));  
    `;
  connection.query(query, async function(err, rows, fields) {
      if(err) {
        console.log('ERROR CREATING TABLE condominios');
        ok = false;
        await sleep(100);
        return;
      }
      console.log('TABLE condominios CREATED');
    });
  await sleep(100);
  if(!ok) {
    return ok;
  }

  query = `
  CREATE TABLE condominioSolNascente.usuarios (
    id INT AUTO_INCREMENT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(45) NOT NULL,
    email VARCHAR(255) NOT NULL,
    senha VARCHAR(45) NOT NULL,
    telefone_celular VARCHAR(45) NOT NULL,
    telefone_fixo VARCHAR(45) NOT NULL,
    condominio_id INT NOT NULL,
    bloco VARCHAR(45),
    apartamento INT,
    funcao VARCHAR(45) NOT NULL,
    salao_festas_id INT NOT NULL,
  PRIMARY KEY (id),
  INDEX condominio_id_idx (condominio_id ASC) VISIBLE, 
  INDEX salao_festas_id_idx (salao_festas_id ASC) VISIBLE,
  CONSTRAINT salao_festas_id_usuarios_fk
    FOREIGN KEY (salao_festas_id)
    REFERENCES condominiosolnascente.condominios (id),
  CONSTRAINT condominio_id_usuarios_fk
    FOREIGN KEY (condominio_id)
    REFERENCES condominioSolNascente.condominios (id)) AUTO_INCREMENT = 1; 
  `;

  connection.query(query, async function(err, rows, fields) {
    if(err) {
      console.log('ERROR CREATING TABLE usuarios');
      ok = false;
      await sleep(100);
      return;
    }
    console.log('TABLE usuarios CREATED');
  });
  await sleep(100);
  if(!ok) {
    return ok;
  }

  query = `
  CREATE TABLE condominiosolnascente.reservas ( 
    id INT NOT NULL AUTO_INCREMENT,
    codigo_condominio INT NOT NULL,
    codigo_salao_festa INT NOT NULL,
    data_inicio DATETIME NOT NULL,
    data_fim DATETIME NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT codigo_condominio_reservas_fk
    FOREIGN KEY (codigo_condominio)
    REFERENCES condominiosolnascente.condominios (id)) AUTO_INCREMENT = 1;
  `;

  connection.query(query, async function(err, rows, fields) {
    if(err) {
      console.log('ERROR CREATING TABLE reservas');
      ok = false;
      await sleep(100);
      return;
    }
    console.log('TABLE reservas CREATED');
  });
  await sleep(100);
  if(!ok) {
    return ok;
  }

  query = `
  CREATE TABLE condominiosolnascente.ocorrencias (
    id INT NOT NULL AUTO_INCREMENT,
    codigo_condominio INT NOT NULL,
    codigo_usuario INT NOT NULL,
    categoria VARCHAR(255) NOT NULL,
    descricao_completa TEXT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT codigo_condominio_ocorrencias_fk
    FOREIGN KEY (codigo_condominio)
    REFERENCES condominiosolnascente.condominios (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT codigo_condomino_ocorrencias_fk
    FOREIGN KEY (codigo_usuario)
    REFERENCES condominiosolnascente.usuarios (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION) AUTO_INCREMENT = 1;
  `;

  connection.query(query, async function(err, rows, fields) {
    if(err) {
      console.log(err)
      console.log('ERROR CREATING TABLE ocorrencias');
      ok = false;
      await sleep(100);
      return;
    }
    console.log('TABLE ocorrencias CREATED');
  });
  await sleep(100);
  if(!ok) {
    return ok;
  }

  query = `
  CREATE TABLE condominiosolnascente.funcionarios (
    id INT NOT NULL AUTO_INCREMENT,
    codigo_condominio INT NOT NULL,
    codigo_usuario INT NOT NULL,
    nome VARCHAR(45) ,
    cpf VARCHAR(45) ,
    turno VARCHAR(45) ,
    funcao VARCHAR(45) ,
    salario FLOAT ,
    endereco_completo VARCHAR(255) ,
  PRIMARY KEY (id),
  CONSTRAINT codigo_usuario_funcionarios_fk
    FOREIGN KEY (codigo_usuario)
    REFERENCES condominiosolnascente.usuarios (id),
  CONSTRAINT codigo_condominio_funcionarios_fk
    FOREIGN KEY (codigo_condominio)
    REFERENCES condominiosolnascente.condominios (id)) AUTO_INCREMENT = 1;  
  `;

  connection.query(query, async function(err, rows, fields) {
    if(err) {
      console.log(err)
      console.log('ERROR CREATING TABLE funcionarios');
      ok = false;
      await sleep(100);
      return;
    }
    console.log('TABLE funcionarios CREATED');
  });
  await sleep(100);
  if(!ok) {
    return ok;
  }

  query = `
  CREATE TABLE condominiosolnascente.achados_perdidos (
    id INT NOT NULL AUTO_INCREMENT,
    codigo_condominio INT NOT NULL,
    codigo_funcionario INT NOT NULL,
    descricao_objeto TEXT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT codigo_condominio_achados_perdidos_fk
    FOREIGN KEY (codigo_condominio)
    REFERENCES condominiosolnascente.condominios (id),
  CONSTRAINT codigo_funcionario_achados_perdidos_fk
    FOREIGN KEY (codigo_funcionario)
    REFERENCES condominiosolnascente.funcionarios (id)) AUTO_INCREMENT = 1;
  `;

  connection.query(query, async function(err, rows, fields) {
    if(err) {
      console.log('ERROR CREATING TABLE achados_perdidos');
      ok = false;
      await sleep(100);
      return;
    }
    console.log('TABLE achados_perdidos CREATED');
  });
  await sleep(100);
  if(!ok) {
    return ok;
  }

  return ok;
}

const createDatabase = async () => {
  let ok = true;
  connection.query('CREATE SCHEMA `condominioSolNascente`', async function(err, rows, fields) {
    if (err) {
      console.log('DATABASE ALREADY EXISTIS, SKIPPING INITIALIZATION');
      ok = false;
      await sleep(100);
      return;
    }
    console.log('DATABASE CREATED');
  });
  await sleep(100);
  return ok;
};

const init = async () => {
  connection.connect();
  let passed = false;

  passed = await createDatabase(); 
  if(!passed) {
    passed = await dropDatabase();
    return
  }
  console.log('CREATING TABLES...');
  passed = await createTables();
  if(!passed) {
    passed = await dropDatabase();
    return
  }

  connection.end();

  const connections = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'condominiosolnascente',  
  });

  connections.query(`INSERT INTO condominioSolNascente.condominios (nome_condominio, cnpj, endereco_completo, codigo_salao_festas)  
    VALUES ('Condomimio Sol Nascente 1', '000.111.222.33', 'Rua Coronel Jesus Negrao, Paraiso, 286', 1);           
  `, (err, rows) => {
    if(err) throw err
   })

   connections.query(`INSERT INTO usuarios (nome, cpf, email, senha, telefone_celular, telefone_fixo, condominio_id, bloco, apartamento, funcao, salao_festas_id)
    VALUES ('Ian', '06601777900', 'ianpalmeida30@gmail.com', '123456', '41997925957', '4733383838', 1, '1A', 100, 'Administrador', 1);  
  `, (err, rows) => {    
    if(err) throw err
   })

   connections.end();


  
  return passed;
}

if(module.parent) {
  console.log('required module')
} else {
  try {
    init()
      .then((resp)=> {
        if(resp) {
          console.log('DATABASE INITIALIZED WITH SUCCESS');
        }
    });
  } catch (e) {
    console.log(e);
  }
}

module.exports = { init };
