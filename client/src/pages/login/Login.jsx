import LoginForm from "./LoginForm";

const Login = (props) => {
  const { onAttAuth } = props;
  return(
    <div>
      <LoginForm onAttAuth={onAttAuth} />
    </div>
  )
}

export default Login;
