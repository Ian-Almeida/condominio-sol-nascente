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
                
            </Route>
            <Route path="/funcionarios">
              
            </Route>
            <Route path="/ocorrencias">
              
            </Route>
            <Route path="/achadosperdidos">
              
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
