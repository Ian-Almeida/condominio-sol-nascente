import { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Select, Popconfirm, DatePicker } from 'antd';
import MaskedInput from "antd-mask-input";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../api';
import { openNotificationWithIcon, formatDate } from '../../utils/utils';

const { Option } = Select;

const Reservas = () => {

  const [registerModal, setRegisterModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);

  const [registerForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  const [tableItems, setTableItems] = useState([]);
  const [condominios, setCondominios] = useState([]);
  const [updatedReserva, setUpdatedReserva] = useState({});

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
      title: 'Condomínio',
      align: 'center',
      dataIndex: 'nome_condominio',
      key: 'nome_condominio',
      render: (text, record) => (
        <span>{text}</span>
      )
    },
    {
      title: 'Data Inicial',
      align: 'center',
      dataIndex: 'data_inicio',
      key: 'data_inicio',
      render: (text, record) => (
        <span>{formatDate(text)}</span>
      )
    },
    {
      title: 'Data Final',
      align: 'center',
      dataIndex: 'data_fim',
      key: 'data_fim',
      render: (text, record) => (
        <span>{formatDate(text)}</span>
      )
    },
    {
      title: 'Ações',
      align: 'center',
      render: (text, record) => (
        <div className="flex justify-center space-x-2">
          <div className="hover:bg-gray-200 rounded-full">
            <EditOutlined onClick={() => {
              const dataInicial = formatDate(record.data_inicio).split(' ');
              const dataFinal = formatDate(record.data_fim).split(' ');
              
              updateForm.setFieldsValue({
                codigo_condominio: record.codigo_condominio, 
                data_inicial: dataInicial[0],
                data_final: dataFinal[0],
                horario_inicial: dataInicial[1],
                horario_final: dataFinal[1],
              });
              setUpdatedReserva({...record});
              setUpdateModalVisible(true);
            }}></EditOutlined>
          </div>
          <div className="hover:bg-gray-200 rounded-full">
            <Popconfirm
              title={<span>Tem certeza que deseja deletar essa Reserva?</span>}
              onConfirm={() => {
                deleteReserva(record);
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

  const deleteReserva = async (values) => {
    try {
      const response = await api.deleteReserva(values.id);
      if(response) {
        openNotificationWithIcon('success', 'bottomLeft', 'Reserva Deletado', 'Reserva deletado com sucesso!');
        const {data} = await api.getReservasByCondominioId(values.codigo_condominio);
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

  const updateReserva = async (state, values) => {
    const obj = {...updatedReserva};

    const dateInicial = values.data_inicial.split('/');
    const dateFinal = values.data_final.split('/');

    const dataInicialString = dateInicial[2] + '-' + dateInicial[1] + '-' + dateInicial[0] + ' ' + values.horario_inicial + ':00';
    const dataFinalString = dateFinal[2] + '-' + dateFinal[1] + '-' + dateFinal[0] + ' ' + values.horario_final + ':00';

    obj.codigo_condominio = values.codigo_condominio;
    obj.data_inicio = dataInicialString;
    obj.data_fim = dataFinalString;

    try {
      const response = await api.updateReserva(obj);
      if(response) {
        openNotificationWithIcon('success', 'bottomLeft', 'Reserva Atualizada', 'Reserva atualizada com sucesso!');
        onSelectFiltroCondominio(obj.codigo_condominio);
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

  const registerReserva = async (state, values) => {
    const dateInicial = values.data_inicial._d;
    const dateFinal = values.data_final._d;

    const dataInicialString = dateInicial.toISOString().split('T')[0] + ' ' + values.horario_inicial + ':00';
    const dataFinalString = dateFinal.toISOString().split('T')[0] + ' ' + values.horario_final + ':00';
    
    const createdReserva = {
      codigo_condominio: values.codigo_condominio,
      data_inicio: dataInicialString,
      data_fim: dataFinalString,
    }

    try {
      const response = await api.registerReserva(createdReserva);
      if(response) {
        openNotificationWithIcon('success', 'bottomLeft', 'Reserva Registrado', 'Reserva registrado com sucesso!');
        onSelectFiltroCondominio(createdReserva.codigo_condominio);
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

  const onSelectFiltroCondominio = async (id) => {
    try {
      const response = await api.getReservasByCondominioId(id);
      if(response) {
        const { data } = response;
        setTableItems(data);
      }
    } catch (err) {
      setTableItems([]);
    }
  }

  return (
    <Card 
    title={
      <div>
        <span className="float-left">RESERVAS</span>
        <div className="float-right">
          <Button onClick={() => setRegisterModalVisible(true)} type="primary">Adicionar Reserva</Button>
        </div>
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
      </div>
      <Table 
        rowKey="id" 
        pagination={{position: ['none', 'bottomCenter'], pageSize: 5}} 
        dataSource={(tableItems)} 
        columns={columns}
       />

      <Modal
        title="Registrar Reserva"
        centered
        visible={registerModal}
        footer={null}
        onCancel={() => setRegisterModalVisible(false)}
       >
         <Form
          form={registerForm}
          name="register"
          onFinish={(values) => registerReserva(false, values)}
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
            key="data-inicial-input"
            rules={[
              {
                required: true,
                message: "Por favor selecione uma data!",
              },
            ]}
          >
            <div className="flex space-x-2">
              <Form.Item
                key="data-inicial"
                name="data_inicial"
                label="Data Inicial"
                rules={[
                  {
                    required: true,
                    message: "Por favor selecione uma data!",
                  },
                ]}
              >
                <DatePicker format={'DD/MM/YYYY'} /> 
              </Form.Item>
              <Form.Item
                key="horario-inicial"
                name="horario_inicial"
              >
                <MaskedInput style={{width: '60px'}} mask="11:11" />
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item
            key="data-final-input"
          >
            <div className="flex space-x-2">
              <Form.Item
                key="data-final"
                name="data_final"
                label="Data Final"
                rules={[
                  {
                    required: true,
                    message: "Por favor selecione uma data!",
                  },
                ]}
              >
                <DatePicker format={'DD/MM/YYYY'} /> 
              </Form.Item>
              <Form.Item
                key="horario-final"
                name="horario_final"
              >
                <MaskedInput style={{width: '60px'}} mask="11:11" />
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="float-right">Concluir</Button>
          </Form.Item>
        </Form>
       </Modal>

       <Modal
        title="Atualizar Reserva"
        centered
        visible={updateModal}
        footer={null}
        onCancel={() => setUpdateModalVisible(false)}
       >
         <Form
          form={updateForm}
          name="update"
          onFinish={(values) => updateReserva(false, values)}
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
            key="data-inicial-input"
          >
            <div className="flex space-x-2">
              <Form.Item
                key="data-inicial"
                name="data_inicial"
                label="Data Inicial"
              >
                <MaskedInput mask="11/11/1111" />
              </Form.Item>
              <Form.Item
                key="horario-inicial"
                name="horario_inicial"
              >
                <MaskedInput style={{width: '60px'}} mask="11:11" />
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item
            key="data-final-input"
          >
            <div className="flex space-x-2">
              <Form.Item
                key="data-final"
                name="data_final"
                label="Data Final"
              >
                <MaskedInput mask="11/11/1111" />
              </Form.Item>
              <Form.Item
                key="horario-final"
                name="horario_final"
              >
                <MaskedInput style={{width: '60px'}} mask="11:11" />
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="float-right">Concluir</Button>
          </Form.Item>
        </Form>
       </Modal>

    </Card>
  )
}

export default Reservas;