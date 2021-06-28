import { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Select, Input, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../api';
import { getLoggedUser, openNotificationWithIcon } from '../../utils/utils';

const { Option } = Select;
const { TextArea } = Input;

const Ocorrencias = () => {
  const [registerModal, setRegisterModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);

  const [registerForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  const [tableItems, setTableItems] = useState([]);
  const [condominios, setCondominios] = useState([]);
  const [updatedOcorrencia, setUpdatedOcorrencia] = useState({});

  const [userCondominio, setUserCondominio] = useState({});

  const user = getLoggedUser();

  const categoriasOptions = [
    'Perturbação',
    'Edifício',
    'Animais',
  ]

  const setRegisterModalVisible = (state) => {
    if(!state) registerForm.resetFields();
    setRegisterModal(state);
  }

  const setUpdateModalVisible = (state) => {
    if(!state) updateForm.resetFields();
    setUpdateModal(state);
  }

  useEffect(() => {
    async function getCondominioByUserId() {
      try {
        const response = await api.getCondominioByUserId(user.id);
        if(response) {
          setUserCondominio({...response.data});
        }
      } catch (err) {
        setUserCondominio({});
      }
      
    }
    getCondominioByUserId()
  }, [user.id]);

  useEffect(() => {
    async function getCondominios() {
      try {
        const response = await api.getCondominios();
        if(response) {
          const { data } = response;
          setCondominios(data);
        }
      } catch (err) {
        setCondominios([]);
      }
    }
    getCondominios();
  }, [])

  useEffect(() => {
    if(Object.keys(userCondominio).length === 0) return
    async function getOcorrenciasByCondominioId() {
      try {
        const response = await api.getOcorrenciasByCondominioId(userCondominio.id);
        if(response) {
          const { data } = response;
          setTableItems(data);
        }
      } catch (err) {
        setTableItems([]);
      }
    }
    getOcorrenciasByCondominioId();
  }, [userCondominio])

  const columns = [
    {
      title: 'Condomínio',
      align: 'center',
      dataIndex: 'nome_condominio',
      key: 'nome_condominio',
      render: (text, record) => (
        <span>{text}</span>
      )
    },
    {
      title: 'Categoria',
      align: 'center',
      dataIndex: 'categoria',
      key: 'categoria',
      render: (text, record) => (
        <span>{text}</span>
      )
    },
    {
      title: 'Descrição Completa',
      align: 'center',
      dataIndex: 'descricao_completa',
      key: 'descricao_completa',
      render: (text, record) => (
        <TextArea readOnly autoSize={{ minRows: 2, maxRows: 4 }} defaultValue={text} />
      )
    },
    {
      title: 'Ações',
      align: 'center',
      render: (text, record) => (
        <div className="flex justify-center space-x-2">
          <div className="hover:bg-gray-200 rounded-full">
            <EditOutlined onClick={() => {
              console.log(record)
              updateForm.setFieldsValue({
                codigo_condominio: record.codigo_condominio, 
                categoria: record.categoria, 
                descricao_completa: record.descricao_completa,
              });
              setUpdatedOcorrencia({...record});
              setUpdateModalVisible(true);
            }}></EditOutlined>
          </div>
          <div className="hover:bg-gray-200 rounded-full">
            <Popconfirm
              title={<span>Tem certeza que deseja deletar essa Ocorrência?</span>}
              onConfirm={() => {
                deleteOcorrencia(record);
              }}
              onCancel={() => {}}
              okText="Sim"
              cancelText="Não"
            >
              <DeleteOutlined></DeleteOutlined>
            </Popconfirm>
          </div>
        </div>
      )
    },
  ];

  const deleteOcorrencia = async(values) => {
    try {
      const response = await api.deleteOcorrencia(values.id);
      if(response) {
        openNotificationWithIcon('success', 'bottomLeft', 'Ocorrência Deletada', 'Ocorrência deletada com sucesso!');
        const {data} = await api.getOcorrenciasByCondominioId(values.codigo_condominio);
        setTableItems(data);
      }
    } catch (err) {
      if(err && err.response){ 
				const message = err.response.data;
				openNotificationWithIcon('error', 'bottomLeft', 'Ocorreu um problema!', message);
        return
      }
      openNotificationWithIcon('error', 'bottomLeft', 'Ocorreu um problema!', 'Erro inesperado!');
    }
  }

  const updateOcorrencia = async(state, values) => {
    
    const obj = {...updatedOcorrencia}
    obj.codigo_condominio = values.codigo_condominio;
    obj.categoria = values.categoria;
    obj.descricao_completa = values.descricao_completa;

    try {
      const response = await api.updateOcorrencia(obj);
      if(response) {
        openNotificationWithIcon('success', 'bottomLeft', 'Ocorrência Atualizado', 'Ocorrência atualizado com sucesso!');
        const {data} = await api.getOcorrenciasByCondominioId(obj.codigo_condominio);
        setTableItems(data);
        setUpdateModal(state);
      }

    } catch (err) {
      if(err && err.response){ 
				const message = err.response.data;
				openNotificationWithIcon('error', 'bottomLeft', 'Ocorreu um problema!', message);
        return
      }
      console.log(err)
      openNotificationWithIcon('error', 'bottomLeft', 'Ocorreu um problema!', 'Erro inesperado!');
    }
  }

  const registerOcorrencia = async(state, values) => {
    const createdOcorrencia = {...values, codigo_usuario: user.id};
    try {
      const response = await api.registerOcorrencia(createdOcorrencia);
      if(response) {
        openNotificationWithIcon('success', 'bottomLeft', 'Ocorrência Registrado', 'Ocorrência registrado com sucesso!');
        const {data} = await api.getOcorrenciasByCondominioId(createdOcorrencia.codigo_condominio);
        setTableItems(data);
        setRegisterModal(state);
      }
    } catch (err) {
      if(err && err.response){ 
				const message = err.response.data;
				openNotificationWithIcon('error', 'bottomLeft', 'Ocorreu um problema!', message);
        return
      }
      openNotificationWithIcon('error', 'bottomLeft', 'Ocorreu um problema!', 'Erro inesperado!');
    }
  }

  return (
    <Card 
    title={
      <div>
        <span className="float-left">OCORRÊNCIAS</span>
        <div className="float-right">
          <Button onClick={() => setRegisterModalVisible(true)} type="primary">Cadastrar Ocorrência</Button>
        </div>
      </div>
    } 
    bordered={true}
    >
      <Table 
        rowKey="id" 
        pagination={{position: ['none', 'bottomCenter'], pageSize: 5}} 
        dataSource={(tableItems)} 
        columns={columns}
       />

      <Modal
        title="Registrar Ocorrência"
        centered
        visible={registerModal}
        footer={null}
        onCancel={() => setRegisterModalVisible(false)}
       >
         <Form
          form={registerForm}
          name="register"
          onFinish={(values) => registerOcorrencia(false, values)}
          scrollToFirstError
        >
          <Form.Item
            name="codigo_condominio"
            label="Condomínio"
            rules={[
              {
                required: true,
                message: "Por favor selecione o condomínio!",
              },
            ]}
          >
            <Select>
              {condominios.map((item, idx) => {
                return (
                  <Option key={`condominio-${idx}`} value={item.id}>
                    {item.nome_condominio}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item
            key="categoria-input"
            name="categoria"
            label="Categoria"
            rules={[
              {
                required: true,
                message: "Por favor selecione a Categoria!",
              },
            ]}
          >
            <Select>
              {categoriasOptions.map((item, idx) => {
                return (
                  <Option key={`categoria-${idx}`} value={item}>
                    {item}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item
            key="descricao-input"
            name="descricao_completa"
            label="Descrição Completa"
            rules={[
              {
                required: true,
                message: "Por favor digite a Descrição Completa!",
              },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="float-right">Concluir</Button>
          </Form.Item>
        </Form>
       </Modal>

       <Modal
        title="Atualizar Ocorrência"
        centered
        visible={updateModal}
        footer={null}
        onCancel={() => setUpdateModalVisible(false)}
       >
         <Form
          form={updateForm}
          name="update"
          onFinish={(values) => updateOcorrencia(false, values)}
          scrollToFirstError
        >
          <Form.Item
            name="codigo_condominio"
            label="Condomínio"
          >
            <Select>
              {condominios.map((item, idx) => {
                return (
                  <Option key={`condominio-${idx}`} value={item.id}>
                    {item.nome_condominio}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item
            key="categoria-input"
            name="categoria"
            label="Categoria"
          >
            <Select>
              {categoriasOptions.map((item, idx) => {
                return (
                  <Option key={`categoria-${idx}`} value={item}>
                    {item}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item
            key="descricao-input"
            name="descricao_completa"
            label="Descrição Completa"
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="float-right">Concluir</Button>
          </Form.Item>
        </Form>
       </Modal>

    </Card>
  )
}

export default Ocorrencias;