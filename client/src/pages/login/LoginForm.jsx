import { Form, Input, Button, Checkbox, Card } from "antd";
import { useHistory } from 'react-router-dom';
import classes from './LoginForm.module.css';
import api from '../../api';
import condominioImage from '../../assets/condominio.png';
import { removeLocalStorage, openNotificationWithIcon } from "../../utils/utils";

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
	required: '${label} e necessário!',
  types: {
    email: 'E-mail inválido!',
  },
}
/* eslint-enable no-template-curly-in-string */

const LoginForm = (props) => {

	const { onAttAuth } = props;

	const history = useHistory();

  const [form] = Form.useForm();
	form.setFieldsValue({remember: localStorage.getItem('remember') === 'true'});

	if(localStorage.getItem('remember') === 'true') {
		form.setFieldsValue({
			email: localStorage.getItem('email'),
			senha: localStorage.getItem('senha'),
		})
	}

  const onFinish = async (values) => {
    const { email, senha, remember } = values;

		try {
			const response = await api.login({email, senha});
			if(response) {
				const data = response.data;
				openNotificationWithIcon('success', 'bottomLeft', 'Login Efetuado', 'Usuário efetuou o login com sucesso!');
				localStorage.setItem('email', email);
				localStorage.setItem('senha', senha);
				localStorage.setItem('funcao', data.funcao);
				localStorage.setItem('nome', data.nome);
				localStorage.setItem('remember', remember);
				localStorage.setItem('id', data.id);
				onAttAuth(true);
				history.push('/home')
			}
		} catch (err) {
			if(err && err.response){ 
				const message = err.response.data;
				openNotificationWithIcon('error', 'bottomLeft', 'Ocorreu um problema!', message);
				onAttAuth(false);
				removeLocalStorage();
				return
			}
			openNotificationWithIcon('error', 'bottomLeft', 'Ocorreu um problema!', 'Erro inesperado!');
			removeLocalStorage();
		}

  };

  return (
		<div className="flex justify-center items-center w-full h-full">
			<Card className="shadow-lg">
				<div className="flex justify-center items-center p-2">
					<img src={condominioImage} alt="logo" className={classes.Logo}/>
				</div>
				<Form
					className="max-w-xs"
					form={form}
					name="control-hooks"
					onFinish={onFinish}
					validateMessages={validateMessages}
					initialValues={{remember: true}}
				>
					{/* <Form.Item className="flex text-center w-full">
						<span className="font-bold text-2xl">Faca seu Login</span>
					</Form.Item> */}
					<Form.Item
						className={classes['input-item']}
						name="email"
						label="E-mail"
						type="email"
						rules={[{ required: true, type: 'email'}]}
					>
						<Input placeholder="E-mail"/>
					</Form.Item>
					<Form.Item
						className={classes['input-item']}
						name="senha"
						label="Senha"
						rules={[{ required: true, message: 'Por favor digite uma senha!' }]}
					>
						<Input type="password" placeholder="Senha"/>
					</Form.Item>

					<Form.Item>
						<Form.Item name="remember" valuePropName="checked" noStyle>
							<Checkbox className="float-left">Manter login</Checkbox>
						</Form.Item>
					</Form.Item>

					<Form.Item>
					<Button className={classes['login-button']} type="primary" htmlType="submit">
							Entrar
					</Button>
					</Form.Item>
				</Form>
			</Card>
		</div>
  );
};

export default LoginForm;
