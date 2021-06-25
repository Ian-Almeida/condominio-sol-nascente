import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import MaskedInput from "antd-mask-input";
import { Form, Select, Input, Button, Card, InputNumber } from "antd";
import api from '../../api';
import { openNotificationWithIcon } from "../../utils/utils";

const { Option } = Select;

const Signup = () => {
  const history = useHistory();

  const DDDs = [
    11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35,
    37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 51, 53, 54, 55, 61, 62, 63, 64, 65,
    66, 67, 68, 71, 73, 74, 75, 77, 79, 81, 83, 84, 85, 88, 89, 91, 92, 93, 94,
    95, 97, 98, 99,
  ];

  const funcoes = [
    { value: "Sindico", label: "Síndico" },
    { value: "Subsindico", label: "Subsíndico" },
    { value: "Morador", label: "Morador" },
    { value: "Zelador", label: "Zelador" },
    { value: "Porteiro", label: "Porteiro" },
  ];

  const [condominios, setCondominios] = useState([]);

  const [form] = Form.useForm();

  const [condominiosOptions, setCondominiosOptions] = useState([]);

  const [selectedFuncao, setSelectedFuncao] = useState('');

  useEffect(() => {
    async function getCondominios() {
      const response = await api.getCondominios();
      if(response) {
        setCondominios(response.data);
      }
    }
    getCondominios()
  }, []);
  
  useEffect(() => {
    setCondominiosOptions(condominios.map(item => {
      return{
        label: item.nome_condominio, 
        value: `${item.id}`
      }
      }));
  }, [condominios])

  const onFinish = async (values) => {
    const createdUser = {...values};
    let salao_festas = 0;

    condominios.forEach(item => {
      if(item.id == values.condominio) salao_festas = item.id; return
    });
    createdUser.salao_festas_id = salao_festas;

    try {
      const response = await api.registerUser(createdUser);
      if(response) {
        openNotificationWithIcon('success', 'bottomLeft', 'Usuário Registrado', 'Usuário registrado com sucesso!');
        history.goBack();
      }
    } catch (err) {
      if(err && err.response){ 
				const message = err.response.data;
				openNotificationWithIcon('error', 'bottomLeft', 'Ocorreu um problema!', message);
      }
      openNotificationWithIcon('error', 'bottomLeft', 'Ocorreu um problema!', 'Erro inesperado!');
    }
  };

  const onSelectFuncaoHandler = (funcao) => {
    setSelectedFuncao(funcao);
  }

  const prefixSelectorCelphone = (
    <Form.Item name="prefix_celphone" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        {DDDs.map((ddd, idx) => {
          return (
            <Option key={`prefix-celphone-${idx}`} value={ddd}>
              ({ddd})
            </Option>
          );
        })}
      </Select>
    </Form.Item>
  );

  const prefixSelectorPhone = (
    <Form.Item name="prefix_phone" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        {DDDs.map((ddd, idx) => {
          return (
            <Option key={`prefix-phone-${idx}`} value={ddd}>
              ({ddd})
            </Option>
          );
        })}
      </Select>
    </Form.Item>
  );

  const moradorFields = () => {
    return ([
      <Form.Item
            key="apartamento-input"
            name="apartamento"
            label="Apartamento"
            rules={[
              {
                required: true,
                message: "Por favor digite o número do apartamento onde mora!",
              },
            ]}
          >
          <Input />
      </Form.Item>,
      <Form.Item
        key="bloco-input"
        name="bloco"
        label="Bloco"
        rules={[
          {
            required: true,
            message: "Por favor digite o bloco onde mora!",
          },
        ]}
        >
        <Input />
      </Form.Item>
    ]
    )
  }

  const funcionarioFields = () => {
    return ([
      <Form.Item
            key="turno-input"
            name="turno"
            label="Turno"
            rules={[
              {
                required: true,
                message: "Por favor selecione o turno em que trabalha!",
              },
            ]}
          >
          <Select placeholder="Turno">
            <Option key="torno-matutino" name="matutino" value="Matutino">Matutino</Option>
            <Option key="torno-vespertino" name="vespertino" value="Vespertino">Vespertino</Option>
            <Option key="torno-noite" name="noite" value="Noite">Noite</Option>
            <Option key="torno-madrugada" name="madrugada" value="Matutino">Madrugada</Option>
            <Option key="torno-integral" name="integral" value="Integral">Integral</Option>
          </Select>
      </Form.Item>,
      <Form.Item
        key="salario-input"
        name="salario"
        label="Salário"
        rules={[
          {
            required: true,
            message: "Por favor digite o Salário!",
          },
        ]}
        >
        <InputNumber
          style={{width: '100%'}}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
        />
      </Form.Item>,
      <Form.Item
      key="endereco-input"
      name="endereco"
      label="Endereço"
      rules={[
        {
          required: true,
          message: "Por favor digite o Endereço Completo de onde mora!",
        },
      ]}
      >
      <Input />
    </Form.Item>
    ]
    )
  }

  return (
    <div className="flex justify-center items-center w-full h-full">
      <Card className="shadow-lg">
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          initialValues={{ prefix_celphone: 47, prefix_phone: 47 }}
          scrollToFirstError
        >
          <Form.Item
            name="nome"
            label="Nome"
            rules={[
              {
                required: true,
                message: "Por favor digite seu Nome!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "E-mail Invalido!",
              },
              {
                required: true,
                message: "Por favor digite um E-mail!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="senha"
            label="Senha"
            rules={[
              {
                required: true,
                message: "Por favor digite uma Senha!",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirmar Senha"
            dependencies={["senha"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Por favor confirme sua Senha!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("senha") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error("As senhas devem ser iguais!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="cpf"
            label="CPF"
            mask=""
            rules={[
              {
                required: true,
                message: "Digite seu CPF!",
              },
            ]}
          >
            <MaskedInput mask="111.111.11-11" />
          </Form.Item>

          <Form.Item
            name="celphone"
            label="Número de Celular"
            rules={[
              {
                required: true,
                message: "Por favor digite seu de número de celular!",
              },
            ]}
          >
            <MaskedInput
              id="celphone-input"
              mask="11111-1111"
              addonBefore={prefixSelectorCelphone}
              style={{
                width: "100%",
              }}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Número Fixo"
            rules={[
              {
                required: true,
                message: "Por favor digite seu de número fixo!",
              },
            ]}
          >
            <MaskedInput
              mask="11111-1111"
              addonBefore={prefixSelectorPhone}
              style={{
                width: "100%",
              }}
            />
          </Form.Item>

          <Form.Item
            name="condominio"
            label="Condôminios"
            rules={[
              {
                required: true,
                message: "Por favor escolha um Condôminio!",
              },
            ]}
          >
            <Select placeholder="Condôminio">
              {condominiosOptions.map((item) => {
                return (
                  <Option 
                  key={`condominio-${item.id}`} 
                  name={item.value} 
                  value={item.value}
                  >{item.label}</Option>
                )
              })}
            </Select>
          </Form.Item>

          <Form.Item
            name="funcao_select"
            label="Função"
            rules={[
              {
                required: true,
                message: "Por favor escolha uma função!",
              },
            ]}
          >
            <Select placeholder="Função" onSelect={onSelectFuncaoHandler}>
              {funcoes.map((funcao) => {
                return (
                  <Option
                    key={`funcao-${funcao.value}`}
                    name={funcao.value}
                    value={funcao.value}
                  >
                    {funcao.label}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          {selectedFuncao === 'Morador' ? moradorFields() : []}
          {['Zelador', 'Porteiro'].includes(selectedFuncao) ? funcionarioFields() : []}

          <Form.Item>
            <div className="flex">
              <Button onClick={() => history.goBack()}>Voltar</Button>
              <Button
                className="w-full rounded-lg"
                type="primary"
                htmlType="submit"
              >
                Registrar
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Signup;
