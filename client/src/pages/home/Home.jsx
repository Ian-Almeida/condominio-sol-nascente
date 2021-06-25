import { getLoggedUser } from '../../utils/utils';

const Home = () => {

  const user = getLoggedUser();

  return(
    <div className="flex justify-center items-center h-screen text-center">
      <span>
      <b>BEM-VINDO</b> <br></br> {user.funcao}(a) {user.nome}<br></br>AO SISTEMA SOL NASCENTE
      </span>
    </div>
  )
}

export default Home;
