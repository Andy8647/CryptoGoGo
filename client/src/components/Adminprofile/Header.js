import React, { Component } from 'react';
import './Profile.css';


class Header extends Component {
    state = {    
    }

    render() { 
        return (
            <div className="ProfileCirclecontainer">             
            	<img className='ProfileCircle' src="profile.jpeg"/>
            </div>
         );
    }
}
 
export default Header;