import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'

import { signup, autologin } from '../../../actions/user'

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {username: '', password: '', passwordrep: '', email: '', isAdmin:false};
    }

    handleChange(key,val){
        this.setState({
            [key]: val
        })
    }

    clickHandler = (app) =>{
        if (this.state.password === this.state.passwordrep) {
            if (this.state.password.length > 3) {
                const reg= /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                if (reg.test(this.state.email)) {
                    //server call to add new User to backend database
                    const body = JSON.parse(JSON.stringify(this.state))
                    console.log(body)
                    signup(body)
                    setTimeout(function(){autologin(body, app)}, 1000) 
                } else {
                    alert('Please enter correct email!')
                }
            } else {
                alert('Password too short!')
            }
        } else {
            alert('Fail to sign up, different password!');
        };

    }

    render() { 
        const { app } = this.props
        return (
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <form>
                        <h3>Sign Up</h3>

                        <div className="form-group">
                            <label>Email address</label>
                            <input type="email" onChange={(v)=>this.handleChange('email',v.target.value)} className="form-control" placeholder="Enter your email" />
                        </div>

                        <div className="form-group">
                            <label>Username</label>
                            <input type="text" onChange={(v)=>this.handleChange('username',v.target.value)} className="form-control" placeholder="Enter username" />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" onChange={(v)=>this.handleChange('password',v.target.value)} className="form-control" placeholder="Enter password" />
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input type="password" onChange={(v)=>this.handleChange('passwordrep',v.target.value)} className="form-control" placeholder="Enter password again" />
                        </div>


                        {/* <div className="form-group">
                            <label>Admin Key</label>
                            <input type="password" onChange={(v)=>this.handleChange('adminkey',v.target.value)} className="form-control" placeholder="(Optional)" />
                        </div> */}

                    {/* <button type="submit" onClick={this.clickHandler} className="btn btn-primary btn-block">Sign Up</button> */}
                    <button type="button" onClick={() => this.clickHandler(app)} className="btn btn-primary btn-block">Sign Up</button>
                    <p className="forgot-password text-right">
                        Already registered <a href="./sign-in">sign in?</a>
                    </p>
                    </form>
                </div>
            </div>
        );
    }
}

export default Signup;