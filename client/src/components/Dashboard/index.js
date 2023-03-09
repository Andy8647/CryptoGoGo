import React, { Component } from 'react';
import Navbar from "../Navbar/index";
import "./styles.css";
import NewsSection from './NewsSection';
import Chart from './Chart';
import Summary from './Summary';
import Activities from './Activities';
import Account from './Account';

class Dashboard extends Component {
    state = {  }
    render() { 
        return ( 
            <div className="dashboard">
                <Chart/>
                <NewsSection />
                <Summary/>
                <Activities/>
                <Account/>
            </div>
         );
    }
}
 
export default Dashboard;