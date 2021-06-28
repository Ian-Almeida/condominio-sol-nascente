import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import { useState } from 'react';

import Home from './pages/home/Home';
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import NavTopBar from './components/NavTopBar';
import AchadosPerdidos from './pages/achadosperdidos/AchadosPerdidos';
import Ocorrencias from './pages/ocorrencias/Ocorrencias';
import Funcionarios from './pages/funcionarios/Funcionarios';
import Reservas from './pages/reservas/Reservas';
import Condominios from './pages/condominios/Condominios';
import Myprofile from './pages/myprofile/Myprofile';


const App = () => {
  const [authenticated, setAuthenticated] = useState(!!localStorage.getItem('email'));

  return (
      <Router>
        <div>
         { authenticated && <NavTopBar onAttAuth={setAuthenticated}/>}

          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/myprofile">
              <Myprofile />
            </Route>
            <Route path="/reservas">
              <Reservas />
            </Route>
            <Route path="/condominios">
              <Condominios />
            </Route>
            <Route path="/funcionarios">
              <Funcionarios />
            </Route>
            <Route path="/ocorrencias">
              <Ocorrencias />
            </Route>
            <Route path="/achadosperdidos">
              <AchadosPerdidos />
            </Route>
            {!authenticated &&<Route path="/login">
              <Login onAttAuth={setAuthenticated}/>
            </Route>}
            <Route path="/signup">
              <Signup />
            </Route>
            <Route path="/home">
              <Home />
            </Route>
            <Route exact path="/">
              {authenticated ? <Redirect to="/home" /> : <Redirect to="/login" />}
            </Route>
          </Switch>
        </div>

    </Router>
  );
}

export default App;
