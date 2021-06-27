import { useState, useEffect } from 'react';
import { Card, Table, Tooltip, Button, Modal, Form, Select, Input, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../api';
import { getLoggedUser, openNotificationWithIcon } from '../../utils/utils';

const { Option } = Select;
const { TextArea } = Input;

const AchadosPerdidos = () => {
  const [registerModalState, setRegisterModalState] = useState(false);
  const [infoModalState, setInfoModalState] = useState(false);
  const [updateModalState, setUpdateModalState] = useState(false);

  const [userCondominio, setUserCondominio] = useState({});

  const [condominioFuncionarios, setCondominioFuncionarios] = useState([]);

  const [tableItems, setTableItems] = useState([]);

  const [registerForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  const user = getLoggedUser();

  const [updatedObject, setUpdatedObject] = useState({});

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
    if(Object.keys(userCondominio).length === 0) return
    async function getAchadosPerdidosByCondominioId() {
      try {
        const response = await api.getAchadosPerdidosByCondominioId(userCondominio.id);
        if(response) {
          setTableItems(response.data);
        }
      } catch (err) {
        setTableItems([]);
      }
      
    }
    getAchadosPerdidosByCondominioId()
  }, [userCondominio]);

  useEffect(() => {
    if(Object.keys(userCondominio).length === 0) return
    async function getFuncionariosByCondominioId() {
      try {
        const response = await api.getFuncionariosByCondominioId(userCondominio.id);
        if(response) {
          setCondominioFuncionarios(response.data);
        }
      } catch (err) {
        setCondominioFuncionarios([]);
      }
    }
    getFuncionariosByCondominioId()
  }, [userCondominio]);

  const columns = [
    {
      title: 'Funcionário',
      align: 'center',
      dataIndex: 'nome',
      key: 'nome',
      render: text => (
      <Tooltip placement="right" title={`Mais informações de ${text}`}>
        <Button 
          onClick={() => setInfoModalVisible(true)} 
          type="dashed"
          >{text}
        </Button>
      </Tooltip>),
    },
    {
      title: 'Descrição',
      align: 'center',
      dataIndex: 'descricao_objeto',
      key: 'descricao_objeto',
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
              updateForm.setFieldsValue({codigo_funcionario: record.codigo_funcionario, descricao: record.descricao_objeto});
              setUpdatedObject({...record});
              setUpdateModalVisible(true);
            }}></EditOutlined>
          </div>
          <div className="hover:bg-gray-200 rounded-full">
            <Popconfirm
              title="Tem certeza que deseja deletar esse objeto?"
              onConfirm={() => deleteObject(record)}
              onCancel={() => {}}
              okText="Sim"
              cancelText="Não"
            >
              <DeleteOutlined onClick=""></DeleteOutlined>
            </Popconfirm>
          </div>
        </div>
      )
    }
  ];

  const setRegisterModalVisible = (state) => {
    setRegisterModalState(state);
  }

  const setUpdateModalVisible = (state) => {
    setUpdateModalState(state);
  }

  const setInfoModalVisible = (state) => {
    setInfoModalState(state);
  }

  const deleteObject = async (item) => {
    try {
      const response = await api.deleteAchadosPerdidosObject(item.id);
      if(response) {
        openNotificationWithIcon('success', 'bottomLeft', 'Objeto Deletado', 'Objeto deletado com sucesso!');
        const {data} = await api.getAchadosPerdidosByCondominioId(item.codigo_condominio);
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

  const registerObject = async (modalState, values) => {
    const createdObjeto = {...values, codigo_condominio: userCondominio.id};
    try {
      const response = await api.registerAchadosPerdidos(createdObjeto);
      if(response) {
        openNotificationWithIcon('success', 'bottomLeft', 'Objeto Registrado', 'Objeto registrado com sucesso!');
        const {data} = await api.getAchadosPerdidosByCondominioId(createdObjeto.codigo_condominio);
        setTableItems(data);
        setRegisterModalState(modalState);
        registerForm.resetFields();
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

  const updateObject = async (modalState, values) => {
    const obj = {...updatedObject}
    obj.codigo_funcionario = values.codigo_funcionario;
    obj.descricao_objeto = values.descricao;
    try {
      const response = await api.updateAchadosPerdidosObject(obj);
      if(response) {
        openNotificationWithIcon('success', 'bottomLeft', 'Objeto Atualizado', 'Objeto atualizado com sucesso!');
        const {data} = await api.getAchadosPerdidosByCondominioId(obj.codigo_condominio);
        setTableItems(data);
        setUpdateModalState(modalState);
        updateForm.resetFields();
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
  
  return (
    <Card 
    title={
      <div>
        <span className="float-left">ACHADOS E PERDIDOS</span>
        <div className="float-right">
          <Button onClick={() => setRegisterModalVisible(true)} type="primary">Adicionar Objeto</Button>
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
        title="Registrar Objeto"
        centered
        visible={registerModalState}
        footer={null}
        onCancel={() => setRegisterModalVisible(false)}
      >
        <Form
          form={registerForm}
          name="register"
          onFinish={(values) => registerObject(false, values)}
          scrollToFirstError
        >
          <Form.Item
            name="codigo_funcionario"
            label="Funcionário"
            rules={[
              {
                required: true,
                message: "Por favor selecione um funcionário!",
              },
            ]}
          >
            <Select>
              {condominioFuncionarios.map((item, idx) => {
                return (
                  <Option
                    key={`funcionario-${idx}`} value={item.id}
                  >{item.nome}</Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="descricao"
            label="Descrição Completa"
            rules={[
              {
                required: true,
                message: "Por favor digite a descrição!",
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
        title="Atualizar Objeto"
        centered
        visible={updateModalState}
        footer={null}
        onCancel={() => setUpdateModalVisible(false)}
      >
        <Form
          form={updateForm}
          name="update"
          onFinish={(values) => updateObject(false, values)}
          scrollToFirstError
        >
          <Form.Item
            name="codigo_funcionario"
            label="Funcionário"
          >
            <Select>
              {condominioFuncionarios.map((item, idx) => {
                return (
                  <Option
                    key={`funcionario-${idx}`} value={item.id}
                  >{item.nome}</Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="descricao"
            label="Descrição Completa"
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="float-right">Concluir</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Informações do funcionario"
        centered
        footer={null}
        visible={infoModalState}
        onOk={() => setInfoModalVisible(false)}
        onCancel={() => setInfoModalVisible(false)}
      >
        FORM
      </Modal>

    </Card>
  )
}

export default AchadosPerdidos;