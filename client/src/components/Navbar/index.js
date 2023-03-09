import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { logout } from '../../actions/user'

import "./styles.css";


class Navbar extends Component {
    logoutUser = (app) => {
        logout(app);
        window.location.pathname = '/sign-in'
    };

    render() { 
        const { app } = this.props
        return ( 
            <div >
                <nav className='main-nav'>
                    <Link to="/">
                        <button className='main-nav-button'> Home </button>
                    </Link>
                    <Link to="/trading">
                        <button className='main-nav-button'> Trading </button>
                    </Link>
                    <Link to="/community">
                        <button className='main-nav-button'> Community </button>
                    </Link>
                    <Link to="/profile">
                        <button className='main-nav-button'> Profile </button>
                    </Link>
                    <button onClick={() => this.logoutUser(app)} className='right-nav-button'> Logout </button>
                </nav>
            </div>
         );
    }
}
 
export default Navbar;