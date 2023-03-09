import React, { Component } from 'react';
import { Route, Switch, BrowserRouter, useHistory} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

import Community from './components/Community';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Trading from './components/Trading';
import Admin from './components/Adminprofile';
import Signup from'./components/Login/Signup';
import Navbar from'./components/Navbar';

import { checkSession } from './actions/user';

class App extends Component {
  state = { 
    currentUser: null,
    isAdmin: false,
    loginStatus: false
  }

  checkLoginStatus() {
    // Check login on server with credentials
    let serverloggedIn = true; // hard coded
    if (serverloggedIn && this.state.loginStatus === false){
      this.setState({
        loginStatus: true
      })
    }
  }

  componentDidMount() {
    // this.checkLoginStatus();
    checkSession(this);
  }

  componentWillUnmount(){
    this.setState({
      loginStatus: false
    })
    // Logout user on server
  }

  render() { 
    return ( 
      <BrowserRouter>
      <Switch>
        <Route exact path='/sign-up'> <Signup app={this}/> </Route>
      </Switch>
      <div>
        {!this.state.loginStatus ? null: <Navbar app={this}/> }
      </div>
      <Switch>
        <Route exact path={['/','/sign-in','/dashboard']} render={ props => 
                  (!this.state.loginStatus ? <Login {...props} app={this} /> : <Dashboard/>)}/>
        <Route exact path={['/sign-in','/trading']} render={ props => 
                  (!this.state.loginStatus ? <Login {...props} app={this} /> : <Trading/>)}/>
        <Route exact path={['/sign-in','/community']} render={ props => 
                  (!this.state.loginStatus ? <Login {...props} app={this} /> : <Community {...props} app={this} />)}/>
        <Route exact path='/profile' render={ props => 
                  (!this.state.loginStatus ? <Login {...props} app={this} /> : <Admin/>)}/>                
      </Switch>
      <footer className="App-footer"> ©2020 Created by Team45 at <a href="https://github.com/csc309-fall-2020/team45" target="_blank"> Github </a> </footer>

      </BrowserRouter>
     );
  }
}
 
export default App;