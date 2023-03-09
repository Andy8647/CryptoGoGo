import React, { Component } from 'react';
import { Redirect } from "react-router";

class Activities extends Component {
    state = { 
        activities: [
            {activityType: "community", content: "Elliot commented on your post", time: "25 min ago", link: "community"}, // Link here will be a hyperlink to some other page, it will be provided by server
            {activityType: "trading", content: "Your order of 0.02 BTC has been executed", time: "30 min ago", link: "community"},
            {activityType: "community", content: "Nancy likes your post", time: "35 min ago", link: "community"},
            {activityType: "community", content: "Nancy likes your post", time: "35 min ago", link: "community"},
            {activityType: "community", content: "Nancy likes your post", time: "35 min ago", link: "community"}
        ]
    }

    async getActivities() {
        const result = await fetch("/api/activities")
        const actvs = await result.json()
        let newActitivies = []
        for (let act of actvs){
            newActitivies.push({
                activityType: act.type,
                content: act.content,
                time: act.timestamp,
                link: act.link
            })
        }
        this.setState({activities: newActitivies})
    }

    componentDidMount() {
        this.getActivities();
        const varID = setInterval(()=>{this.getActivities()}, 5000) // periodically pull from server to check on orders
        this.setState({varID:varID})
    }

    componentWillUnmount() {
        clearInterval(this.state.varID)
    }

    routeToActivity = (path) => {
        
        return <Redirect to={path} />
    } 

    renderActivity = (activity) => {
        return <div className={"activity-type-" + activity.activityType}>
                    <a href={activity.link}>                   
                    <p className="activity-content"> {activity.content} </p>
                    <p className="activity-time"> {activity.time} </p>
                    </a>
 
                </div>
    }

    render() { 
        return (
            <div className="summary-activities">
                <h3 className="activities-title"> Activities </h3>
                <div className="activities-container"> 
                    {this.state.activities.map(this.renderActivity)}
                </div>
            </div>
          );
    }
}
 
export default Activities;