import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  IdcardOutlined,
  InboxOutlined,
  AlertOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Tooltip, Modal } from "antd";
import { removeLocalStorage, openNotificationWithIcon, getLoggedUser } from "../utils/utils";

import { Menu } from "antd";

const NavTopBar = (props) => {
  const history = useHistory();
  const [current, setCurrent] = useState("");
  const [modalState, setModalState] = useState(false);
  const { onAttAuth } = props;
  const user = getLoggedUser();

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  const onChangeModalState = (state) => {
    setModalState(state);
  };

  const onLogout = () => {
    onAttAuth(false);
    removeLocalStorage();
    openNotificationWithIcon(
      'info', 
      'bottomLeft', 
      'Sessão finalizada', 
      'Usuário saiu da sessão com sucesso!'
      );
    history.push("/login");
  };

  return (
    <div className="flex w-full">
      <div className="absolute left-0 p-2">
        <Link to="/" className="">
          Home
        </Link>
      </div>
      <Menu
        onClick={handleClick}
        selectedKeys={current}
        mode="horizontal"
        className="flex justify-center w-full"
      >
        <Menu.Item key="condominio" icon={<HomeOutlined />}>
          Condomínio
          <Link to="/condominio"></Link>
        </Menu.Item>
        <Menu.Item key="achadosPerdidos" icon={<InboxOutlined />}>
          Achados e Perdidos
          <Link to="/achadosperdidos"></Link>
        </Menu.Item>
        <Menu.Item key="funcionarios" icon={<IdcardOutlined />}>
          Funcionarios
          <Link to="/funcionarios"></Link>
        </Menu.Item>
        <Menu.Item key="ocorrencias" icon={<AlertOutlined />}>
          Ocorrências
          <Link to="/ocorrencias"></Link>
        </Menu.Item>
      </Menu>
      <div className="absolute right-0 p-2">
        <span className="mr-1">{localStorage.getItem('nome')}</span>
        <Tooltip placement="topLeft" title="Minha Conta">
          <Button
            onClick={() => onChangeModalState(true)}
            shape="circle"
            icon={<UserOutlined />}
            className="absolute"
          ></Button>
        </Tooltip>
        <Modal
          title="Gerenciar"
          centered
          footer={null}
          visible={modalState}
          onOk={() => onChangeModalState(false)}
          onCancel={() => onChangeModalState(false)}
        >
          <div className="flex justify-center space-x-10">
            <Button onClick={() => {
              onChangeModalState(false);
              history.push('/myprofile')
            }}>Minha conta</Button>
            {user.funcao === 'Administrador' && <Button onClick={() => {
              onChangeModalState(false);
              history.push('/signup')
            }}>Registrar</Button>}
            <Button onClick={onLogout}>Sair</Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default NavTopBar;
