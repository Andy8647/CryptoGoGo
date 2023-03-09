 import React, { Component } from 'react';
import './Profile.css';
import { Redirect } from "react-router";

class List extends Component {
    constructor(props) {
      super(props);
    this.state = { 
      users: [
      {userid: 1, username: 'AA', show: false},
      {userid: 2, username: 'BB', show: false},
      {userid: 3, username: 'CC', show: false}
      ],
      searchid: 1,
      tableshow: false
      //Will be the Values from the Admins in the backend
      }
      this.deleteAccount = this.deleteAccount.bind(this);
      
    }

    // searchAccount = (id) => {
    //   const usersinfo = this.state.users
    //   let found = this.state.users.filter(s => {
    //     return s.userid === id });
    //   this.setState({ usersinfo: found});
    // }
    deleteAccount = (user)  => {
      let removed = this.state.users.filter(user => {
        return user !== user});
      this.setState({ usersinfo: removed});
    }

    generateUserTableRows = () => {
      const usersinfo = this.state.users
      let tableRows = [];
      tableRows.push(
       <tr>
          <th> UserId </th>
          <th> UserName </th>
          <th> AddAdmin </th>
          <th> ManageAccount </th>
      </tr>
      );
      for (let i = 0; i < usersinfo.length; i++){
          tableRows.push(
          <tr> 
            <td> {usersinfo[i].userid} </td>
            <td> {usersinfo[i].username} </td>
            <td> {<button className='AddAdmin'>Set Administrator</button>} </td>
            <td> {<button className='Delete' onClick={() => this.deleteAccount(usersinfo[i])}>Delete Account</button>}  </td>
          </tr>
        );
      }
      if (!this.state.tableshow) {
      return <table className="user-table"> {tableRows.map(tableRows => tableRows)} </table>;
        }
      }

    generateSearchTableRows = (id) => {
      const usersinfo = this.state.users
      let tableRows = [];
      tableRows.push(
       <tr>
          <th> UserId </th>
          <th> UserName </th>
          <th> AddAdmin </th>
          <th> ManageAccount </th>
      </tr>
      );
      for (let i = 0; i < usersinfo.length; i++){
        if (usersinfo[i].userid === id) {
          tableRows.push(
          <tr> 
            <td> {usersinfo[i].userid} </td>
            <td> {usersinfo[i].username} </td>
            <td> {<button className='AddAdmin'>Set Administrator</button>} </td>
            <td> {<button className='Delete' onClick={() => this.deleteAccount(usersinfo[i])}>Delete Account</button>}  </td>
          </tr>
          )
        }
      }
      if (this.state.tableshow) {
        return <table className="search-table"> {tableRows.map(tableRows => tableRows)} </table>;
      }
    }
    

    onClick = () => {
        this.setState({ tableshow: !this.props.tableshow });
    }
    inputChange = (e) => {
      this.setState({
            [this.state.searchid]: e.target.value
      });
    }

    render() { 
        return ( 
                <div className="list">
                 <div className="search">
                  <p>Search User By ID</p>
                  <input 
                    type="text" 
                    placeholder="Search ID" 
                    onChange= {(e) => this.inputChange(e)}/>
                  <button onClick={(e) => this.onClick()}> Search</button>
                  {this.generateSearchTableRows(this.state.searchid)}
                                    </div>
                  {this.generateUserTableRows ()}
                </div>
        );
    }
}

 
export default List;