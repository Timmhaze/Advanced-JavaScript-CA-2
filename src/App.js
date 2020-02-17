import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import PieceIndex from './views/pieces/Index'
import PieceShow from './views/pieces/Show'
import PieceEdit from './views/pieces/Edit'
import MyNavbar from './components/MyNavbar'
import PieceCreate from './views/pieces/Create'
import Register from './views/auth/Register'
import Login from './views/auth/Login'

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: localStorage.getItem('jwtToken') !== null,
    };
  }

  authHandler = () => {
    this.setState((state, props) => ({
      loggedIn: state.loggedIn ? false : true
    }));
  }

  render() {
    const loggedIn = this.state.loggedIn;
    return (
      <BrowserRouter>
        <MyNavbar loggedIn={loggedIn} onLogout={this.authHandler} />
        <Container>
          <Row>
            <Col>
            <Switch>
              <Route exact path="/" component={PieceIndex} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/pieces/create">
                {loggedIn ? <PieceCreate/ > : <Redirect to ="/"/>}
              </Route>
              <Route exact path="/pieces/:id/edit" component={PieceEdit}></Route>
              <Route exact path="/pieces/:id">{(props) => <PieceShow {...props} loggedIn={loggedIn}/>}</Route>
              <Route exact path="/login" component={(props) => <Login {...props} loggedIn = {loggedIn} onLogin={this.authHandler} />} />
            </Switch>
            </Col>
          </Row>
        </Container>
      </BrowserRouter>
    );
  }
}

export default App;
