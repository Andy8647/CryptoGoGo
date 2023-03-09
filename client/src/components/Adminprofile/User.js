import React, { Component } from 'react';
import Navbar from "../Navbar/index";
import './Profile.css';
import Sidebar from './Content'
import Information from './Information'
import List from './List'

class User extends Component {
    state = {  }
    render() { 
        return (
           <div className='title'>
           		<List/>
                </div>
         );
    }
}
 
export default User;