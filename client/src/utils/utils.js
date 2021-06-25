import {notification} from 'antd';

export const removeLocalStorage = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("senha");
    localStorage.removeItem("remember");
    localStorage.removeItem("funcao");
    localStorage.removeItem("nome");
    localStorage.removeItem("id");
}

export const getLoggedUser = () => {
    return {
        email: localStorage.getItem('email'),
        senha: localStorage.getItem('senha'),
        funcao: localStorage.getItem('funcao'),
        nome: localStorage.getItem('nome'),
        id: localStorage.getItem('id'),
    }
}

export const openNotificationWithIcon = (type, placement, title, text) => {
    notification[type]({
      message: title,
      description: text,
          placement,
    });
  };