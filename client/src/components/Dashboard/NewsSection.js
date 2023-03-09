import React, { Component } from 'react';
import News from './News'

class NewsSection extends Component {
    state = { 
        newsList: [
        ],
        articles: {},
        maxArticles: 2
    }

    populateNewsSection = () => {
        let newArticles = [];
        const allArticles = this.state.articles.news;
        console.log(allArticles)
        for (let i = 0; i < this.state.maxArticles && i < allArticles.length; i++){
            let articleObj = {
                site: allArticles[i].author,
                title:  allArticles[i].title,
                url:  allArticles[i].url,
                text:  allArticles[i].description,
                published:  allArticles[i].published,
                image:  allArticles[i].image
            };
            newArticles.push(articleObj);
        }
        this.setState({newsList:newArticles, maxArticles: this.state.maxArticles + 2});
    }

    getNewsFromGoogleNews() {
        const apiKey = "aSU8TpgLOVmu53r3SIbkEmoN6MdzmX-5ZpNa6BEjNZ28RAs1";

        
        const url = "https://api.currentsapi.services/v1/search?" + 'keywords=Cryptocurrency&language=en&' +  `apiKey=${apiKey}`;
        return fetch(url)
        .then(response => response.json())
        .then((data) => 
            {
                console.log(data)
                this.setState({articles: data, }, this.populateNewsSection);
            });
    }

    componentDidMount() {
        this.getNewsFromGoogleNews()
    }

    render() { 
        return ( 
            <div className='news-list-container'>
                <h className="news-header"> News </h>
                {this.state.newsList.map(
                    (news) => <News site={news.site} title={news.title} url={news.url} text={news.text} published={news.published} image={news.image}/>)}

                <button className="news-read-more-btn" onClick={this.populateNewsSection}> read more </button>
            </div>
        );
    
    }
}
 
export default NewsSection;