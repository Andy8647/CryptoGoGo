import React, { Component } from 'react';

class News extends Component {
    state = {  }
    render() { 
        return (
            <a className="dashboard-link" href={this.props.url} target="_blank">
                <div className='news-story-container'>
                    <img src={this.props.image} className='news-story-image'/>
                    <h3 className='news-story-headline'> {this.props.title} </h3>
                    <p> {this.props.text} </p>
                    <span className='news-story-site'> {this.props.site} </span>
                </div>
            </a>
         );
    }
}
 
export default News;