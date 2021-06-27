import { useState, useEffect } from 'react';
import { Card, Table, Tooltip, Button, Modal, Form, Select, Input, InputNumber, Popconfirm } from 'antd';
import MaskedInput from "antd-mask-input";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import api from '../../api';
import { getLoggedUser, openNotificationWithIcon } from '../../utils/utils';

const { Option } = Select;
const { TextArea } = Input;

const Condominios = () => {
  const [registerModal, setRegisterModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);

  const [registerForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  const [tableItems, setTableItems] = useState([]);
  const [updatedCondominio, setUpdatedCondominio] = useState({});

  const [userCondominio, setUserCondominio] = useState({});
  const user = getLoggedUser();

  const setRegisterModalVisible = (state) => {
    if(!state) registerForm.resetFields();
    setRegisterModal(state);
  }

  const setUpdateModalVisible = (state) => {
    if(!state) updateForm.resetFields();
    setUpdateModal(state);
  }

  useEffect(() => {
    async function getCondominios() {
      try {
        const response = await api.getCondominios();
        if(response) {
          const { data } = response;
          setTableItems(data);
        }
      } catch (err) {
        setTableItems([]);
      }
    }
    getCondominios();
  }, [])

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

  const columns = [
    {
      title: 'Nome do Condomínio',
      align: 'center',
      dataIndex: 'nome_condominio',
      key: 'nome_condominio',
      render: (text, record) => (
        <span>{text}</span>
      )
    },
    {
      title: 'CNPJ',
      align: 'center',
      dataIndex: 'cnpj',
      key: 'cnpj',
      render: (text, record) => (
        <span>{text}</span>
      )
    },
    {
      title: 'Endereço Completo',
      align: 'center',
      dataIndex: 'endereco_completo',
      key: 'endereco_completo',
      render: (text, record) => (
        <span>{text}</span>
      )
    },
    {
      title: 'Ações',
      align: 'center',
      render: (text, record) => (
        <div className="flex justify-center space-x-2">
          <div className="hover:bg-gray-200 rounded-full">
            <EditOutlined onClick={() => {
              updateForm.setFieldsValue({
                nome_condominio: record.nome_condominio, 
                cnpj: record.cnpj, 
                codigo_salao_festas: record.codigo_salao_festas,
                endereco_completo: record.endereco_completo,
              });
              setUpdatedCondominio({...record});
              setUpdateModalVisible(true);
            }}></EditOutlined>
          </div>
          <div className="hover:bg-gray-200 rounded-full">
            <Popconfirm
              title={<span>Tem certeza que deseja deletar esse condomínio?<br/> Todos os outros registros relacionados a ele serão apagados!</span>}
              onConfirm={() => {
                deleteCondominio(record);
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

  const updateCondominio = async(state, values) => {
    const obj = {...updatedCondominio}
    obj.nome_condominio = values.nome_condominio;
    obj.cnpj = values.cnpj;
    obj.codigo_salao_festas = values.codigo_salao_festas;
    obj.endereco_completo = values.endereco_completo;

    try {
      const response = await api.updateCondominio(obj);
      if(response) {
        openNotificationWithIcon('success', 'bottomLeft', 'Condomínio Atualizado', 'Condomínio atualizado com sucesso!');
        const {data} = await api.getCondominios();
        setTableItems(data);
        setUpdateModal(state);
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

  const deleteCondominio = async(values) => {
    if(values.id === userCondominio.id) {
      openNotificationWithIcon('error', 'bottomLeft', 'Ocorreu um problema!', 'Não é possível apagar o condomínio relacionado à conta atual');
      return
    }
    try {
      const response = await api.deleteCondominio(values.id);
      if(response) {
        openNotificationWithIcon('success', 'bottomLeft', 'Condomínio Deletado', 'Condomínio deletado com sucesso!');
        const {data} = await api.getCondominios();
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

  const registerCondominio = async(state, values) => {
    try {
      const response = await api.registerCondominio(values);
      if(response) {
        openNotificationWithIcon('success', 'bottomLeft', 'Condomínio Registrado', 'Condomínio registrado com sucesso!');
        const {data} = await api.getCondominios();
        setTableItems(data);
        setRegisterModalVisible(state);
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
        <span className="float-left">CONDOMÍNIOS SOL NASCENTE</span>
        <div className="float-right">
          <Button onClick={() => setRegisterModalVisible(true)} type="primary">Cadastrar Condomínio</Button>
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
        title="Registrar Condomínio"
        centered
        visible={registerModal}
        footer={null}
        onCancel={() => setRegisterModalVisible(false)}
       >
         <Form
          form={registerForm}
          name="register"
          onFinish={(values) => registerCondominio(false, values)}
          scrollToFirstError
        >
          <Form.Item
            name="nome_condominio"
            label="Nome do Condomínio"
            rules={[
              {
                required: true,
                message: "Por favor digite o nome do condomínio!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="cnpj"
            label="CNPJ"
            rules={[
              {
                required: true,
                message: "Por favor digite o CNPJ!",
              },
            ]}
          >
            <MaskedInput mask="11.111.111/0001-11" placeholder="XX.XXX.XXX/000X-XX" />
          </Form.Item>
          <Form.Item
            key="codigo-input"
            name="codigo_salao_festas"
            label="Código do Salão de Festas"
            rules={[
              {
                required: true,
                message: "Por favor digite o Código do Salão de Festas!",
              },
            ]}
          >
            <InputNumber min={1}/>
          </Form.Item>
          <Form.Item
            key="endereco-input"
            name="endereco_completo"
            label="Endereço Completo"
            rules={[
              {
                required: true,
                message: "Por favor digite o Endereço Completo!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="float-right">Concluir</Button>
          </Form.Item>
        </Form>
       </Modal>

       <Modal
        title="Atualizar Condomínio"
        centered
        visible={updateModal}
        footer={null}
        onCancel={() => setUpdateModalVisible(false)}
       >
         <Form
          form={updateForm}
          name="update"
          onFinish={(values) => updateCondominio(false, values)}
          scrollToFirstError
        >
          <Form.Item
            name="nome_condominio"
            label="Nome do Condomínio"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="cnpj"
            label="CNPJ"
          >
            <MaskedInput mask="11.111.111/0001-11" placeholder="XX.XXX.XXX/000X-XX" />
          </Form.Item>
          <Form.Item
            key="codigo-input"
            name="codigo_salao_festas"
            label="Código do Salão de Festas"
          >
            <InputNumber min={1}/>
          </Form.Item>
          <Form.Item
            key="endereco-input"
            name="endereco_completo"
            label="Endereço Completo"
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="float-right">Concluir</Button>
          </Form.Item>
        </Form>
       </Modal>
    </Card>
  )
}

export default Condominios;