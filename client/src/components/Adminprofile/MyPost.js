 import React, { Component } from 'react';
import './Profile.css';
import { Redirect } from "react-router";


class MyPost extends Component {
   state = { 
        total: 136,
        Likes: 340,
   }
    render() {
    	return {
    		<div className='dashboard-summary'>
                <div>
                    <h3 className='summary-fields'> Summary </h3>
                </div>
                <div className='summary-fields'> Manage My Post <a class="active" href="/community">Manage Posts</a> </div>

            </div>

    	}
    }
 }
export default MyPost;