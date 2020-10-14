import React, { useContext } from 'react';
import SignIn from './components/SignIn';
import Main from './components/Main';
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import { AuthContext } from './services/auth';

function PrivateRoute({ children, ...rest }) {
  const authData = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={() => {
        return authData.IsAuthenticated ? (children) : (
          <Redirect
            to={{
              pathname: "/login"
            }}
          />
        )
      }}
    />
  );
}

function App() {
  const data = {
    IsAuthenticated: false,
    Id: '',
    Name: '',
    Authenticate(authData) {
      this.IsAuthenticated = authData.IsAuthenticated;
      this.Name = authData.Name;
      this.Id = authData.Id;
    },
    Signout() {
      this.IsAuthenticated = false;
      this.Name = '';
      this.Id = '';
    }
  };
  return (
    <AuthContext.Provider value={data}>
      <BrowserRouter>
        <Switch>
          <PrivateRoute path="/" exact>
            <Main />
          </PrivateRoute>
          <PrivateRoute path="/home" >
            <Main />
          </PrivateRoute>
          <Route path="/login" component={SignIn} />
        </Switch>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
