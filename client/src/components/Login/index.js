import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'
import { login } from '../../actions/user'
import { configConsumerProps } from 'antd/lib/config-provider';


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {username: '', password: ''};
        //this.props.history.push("/sign-in");
    }

    handleChange(key,val){
        this.setState({
            [key]: val
        })
    }

    render() { 
        const { app } = this.props

        return (
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <form>
                        <h3>Sign In</h3>

                        <div className="form-group">
                            <label>Username</label>
                            <input type="text" onChange={(v)=>this.handleChange('username',v.target.value)} className="form-control" placeholder="Enter username" />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" onChange={(v)=>this.handleChange('password',v.target.value)} className="form-control" placeholder="Enter password" />
                        </div>

                        {/* <div className="form-group">
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="customCheck1" />
                                <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                            </div>
                        </div> */}

                        <button type="button" onClick={() => login(this, app)} className="btn btn-primary btn-block">Sign In</button>
                        <p className="forgot-password text-right">
                            New user you want to <a href="./sign-up">sign up?</a>
                        </p>
                    </form>
                </div>
            </div>
        );
    }
}

 
export default Login;