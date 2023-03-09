import React, { Component } from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { Nav, Navbar, Form, FormControl } from 'react-bootstrap';
import Information from './Information'
import Header from './Header'
import MyWallet from './MyWallet'
import List from './List'
import Community from '../Community'
import './Profile.css';


class Sidebar extends Component {
    constructor(props) {
      super(props);
      this.state = {
        assets: [
         {
          symbol: 'Home',
          key: 0
          },
          {
          symbol: 'My Wallet',
          key: 1
        },
        {
          symbol: "My Post",
          key: 2
        },
        {
          symbol: "ManageUsers",
          key: 3
        },
        {
          symbol: "ManagePosts",
          key: 4
        }
      ],
       curr: 0,
    }
  }

    HandleClick = (data) => {
      const content = this.state.assets
      this.setState({ curr: data.key });

    }

    generateSidebar = () => {
      const content = this.state.assets
      let buttonList = [];
      for (let i = 0; i < content.length; i++) {
        buttonList.push(
            <Link onClick={() =>this.HandleClick(content[i])}> {content[i].symbol} </Link> 
        );
      }
        return <div className="sidebar">{buttonList.map(buttonList => buttonList)}</div>;
    }

  render() {
        let finalComponent;
        if (this.state.curr === 0) {
            finalComponent = <div>
              <Header/> 
              <Information/>
              </div>;
        }
        if (this.state.curr === 1) {
           finalComponent = <MyWallet/>;
        }
        if (this.state.curr === 2) {
            window.location.href = '/community'
        }
        if (this.state.curr === 3) {
            finalComponent = <List/>;
        }
        if (this.state.curr === 4) {
            window.location.href = '/community'
        }
       return(
            <div>
                {this.generateSidebar()}
            <div className = "right">
              {finalComponent}
            </div>
            </div>
       );
   }
}
export default Sidebar;

