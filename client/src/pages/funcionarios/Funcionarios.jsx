import { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Select, Input, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../api';
import { openNotificationWithIcon } from '../../utils/utils';

const { Option } = Select;

const Funcionarios = () => {
  const [updateModal, setUpdateModal] = useState(false);

  const [updateForm] = Form.useForm();

  const [tableItems, setTableItems] = useState([]);
  const [condominios, setCondominios] = useState([]);
  const [updatedFuncionario, setUpdatedFuncionario] = useState({});
  // eslint-disable-next-line
  const [updateSelectedFuncao, setUpdateSelectedFuncao] = useState('');
  // eslint-enable-next-line
  // const [userCondominio, setUserCondominio] = useState({});
  // const user = getLoggedUser();

  const funcoes = [
    { value: "Sindico", label: "Síndico" },
    { value: "Subsindico", label: "Subsíndico" },
    { value: "Morador", label: "Morador" },
    { value: "Zelador", label: "Zelador" },
    { value: "Porteiro", label: "Porteiro" },
  ];

  const setUpdateModalVisible = (state) => {
    if(!state) updateForm.resetFields();
    setUpdateModal(state);
  }

  const onSelectFuncaoHandler = (funcao) => {
    setUpdateSelectedFuncao(funcao);
  }

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

  const columns = [
    {
      title: 'Nome',
      align: 'center',
      dataIndex: 'nome',
      key: 'nome',
      render: (text, record) => (
        <span>{text}</span>
      )
    },
    {
      title: 'Turno',
      align: 'center',
      dataIndex: 'turno',
      key: 'turno',
      render: (text, record) => (
        <span>{text}</span>
      )
    },
    {
      title: 'Função',
      align: 'center',
      dataIndex: 'funcao',
      key: 'funcao',
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
                nome: record.nome, 
                turno: record.turno, 
                funcao: record.funcao,
              });
              setUpdatedFuncionario({...record});
              setUpdateModalVisible(true);
            }}></EditOutlined>
          </div>
          <div className="hover:bg-gray-200 rounded-full">
            <Popconfirm
              title={<span>Tem certeza que deseja deletar esse funcionário?</span>}
              onConfirm={() => {
                deleteFuncionario(record);
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

  const onSelectFiltroCondominio = async (id) => {
    try {
      const response = await api.getFuncionariosByCondominioId(id);
      if(response) {
        const { data } = response;
        setTableItems(data);
      }
    } catch (err) {
      setTableItems([]);
    }
  }

  const deleteFuncionario = async (values) => {
    try {
      const response = await api.deleteFuncionario(values.id);
      if(response) {
        openNotificationWithIcon('success', 'bottomLeft', 'Funcionário Deletado', 'Funcionário deletado com sucesso!');
        const {data} = await api.getFuncionariosByCondominioId(values.codigo_condominio);
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

  const updateFuncionario = async (state, values) => {
    const obj = {...updatedFuncionario}
    obj.nome = values.nome;
    obj.turno = values.turno;
    obj.funcao = values.funcao;

    try {
      const response = await api.updateFuncionario(obj);
      if(response) {
        openNotificationWithIcon('success', 'bottomLeft', 'Funcionário Atualizado', 'Funcionário atualizado com sucesso!');
        const {data} = await api.getFuncionariosByCondominioId(obj.codigo_condominio);
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

  const teste = () => {
    console.log(tableItems)
  }

  return (
    <Card 
    title={
      <div>
        <span className="float-left">FUNCIONÁRIOS</span>
      </div>
    } 
    bordered={true}
    >
      <div className="space-x-2">
        <label htmlFor="all-condominios">Condomínio:</label>
        <Select 
        onSelect={(id) => onSelectFiltroCondominio(id)}
        id="all-condominios" 
        className="w-96"
        >
          {condominios.map((item, idx) => {
            return (
              <Option key={`funcionario-${idx}`} value={item.id}>
                {item.nome_condominio}
              </Option>
            )
          })}
        </Select>
        <Button onClick={teste}>teste</Button>
      </div>
      <Table 
        rowKey="id" 
        pagination={{position: ['none', 'bottomCenter'], pageSize: 5}} 
        dataSource={(tableItems)} 
        columns={columns}
       />

      <Modal
        title="Atualizar Funcionário"
        centered
        visible={updateModal}
        footer={null}
        onCancel={() => setUpdateModalVisible(false)}
       >
         <Form
          form={updateForm}
          name="update"
          onFinish={(values) => updateFuncionario(false, values)}
          scrollToFirstError
        >
          <Form.Item
            name="nome"
            label="Nome"
          >
            <Input />
          </Form.Item>
          <Form.Item
            key="turno-input"
            name="turno"
            label="Turno"
          >
            <Select placeholder="Turno">
              <Option key="torno-matutino" name="matutino" value="Matutino">Matutino</Option>
              <Option key="torno-vespertino" name="vespertino" value="Vespertino">Vespertino</Option>
              <Option key="torno-noite" name="noite" value="Noite">Noite</Option>
              <Option key="torno-madrugada" name="madrugada" value="Matutino">Madrugada</Option>
              <Option key="torno-integral" name="integral" value="Integral">Integral</Option>
            </Select>
          </Form.Item>
          <Form.Item
            key="funcao-input"
            name="funcao"
            label="Função"
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
          <Form.Item>
            <Button type="primary" htmlType="submit" className="float-right">Concluir</Button>
          </Form.Item>
        </Form>
       </Modal>

    </Card>
  )
}

export default Funcionarios;