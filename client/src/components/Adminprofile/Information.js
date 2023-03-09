import React, { Component } from 'react';
import './Profile.css';
import Header from './Header'

class Information extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hide: true,
            password: 'aaaaaa', 
            //Will be the Values from the users in the backend
            reset: false
        };
        this.handlechange = this.handlechange.bind(this);
        this.toggleshow = this.toggleshow.bind(this);
    }

    sumbit = () => {
        if (window.confirm('DO YOU WANT TO LOG OUT?')){
            alert('Sign out success');
            window.location="/sign-in";
        } else {
            alert('Sign out fail');
        } 
    }

    handlechange = (event) => {
        this.setState({password: event.target.value});
    }

    toggleshow = () => {
        this.setState({ hide: !this.state.hide});
    }

    componentDidMount() {
        if (!this.props.hide) {
            this.setState({ password: this.props.password });
        }
    }

    hidecomp = () => {
        this.setState({ reset: !this.props.reset });
    }

    generateInfoTable = () => {
        let table = [];
        table.push(
        <tr>
          <th> Information </th>
          <th> Detail</th>
        </tr>
        );
        table.push(
        <tr> 
          <td> UserName </td>
          <td> jjjjj123</td>
        </tr>
        );
        table.push(
        <tr>
          <td> E-mail </td>
          <td> jjjjj123@gmail.com</td>
        </tr>
                );
        table.push(
        <tr>
          <td> Password </td>
          <td> <input type={this.state.hide ? 'password' : ''} 
                    value={this.state.password} 
                    onChange = {this.handlechange}
                /> <button onClick={this.toggleshow}>Show</button></td>
        </tr>
                );
        table.push(
        <tr>
          <td> Profession </td>
          <td> Teacher</td>
        </tr>
                );
        table.push(
        <tr>
          <td> Address </td>
          <td> 40 Willcocks Street</td>
        </tr>
                );
        table.push(
        <tr>
          <td> Posts Number </td>
          <td> 156</td>
        </tr>
        );
        return <table className="information-table"> {table.map(table => table)} </table>;
    }

    render() { 
        const reset = this.state.reset;
        let button;
        return (
                <div className='Information'>      
                    {this.generateInfoTable()}

                <input className='information-button' onClick={this.hidecomp} type="submit" value="Reset Password" /> 
                </div>

        );
    }
}
    

 
export default Information;