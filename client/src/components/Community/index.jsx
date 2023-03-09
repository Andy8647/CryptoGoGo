import React, { Component } from 'react';
import SearchBox from "./SearchBox"
import PostList from "./PostList/index"
import { getPosts, searchPost } from "./actions/stack"
import NewPostForm from './NewPost';
import { Button } from '@material-ui/core';


class Community extends Component {
    constructor(props) {
        super(props);
        this.props.history.push("/community");
        this.state = {
            searched: false,
            filteredPost: [],
            postList: []
        };
    }

    handleInput = (event) => {
        const kw = event.target.value.toLowerCase().trim();
        if (kw === "") {
            this.setState({ searched: false })
        } else {
            this.setState({ searched: true })
        }
        if (this.state.searched) {
            this.setState({ filteredPost: searchPost(kw, this.state.postList) })
        }
    }



    componentDidMount() {
        // getPosts(this);
        const idVar = setInterval(() => {
            getPosts(this);
        }, 1000)
        this.setState({ idVar: idVar })
    }

    componentWillUnmount() {
        clearInterval(this.state.idVar)
     }

    

    // componentDidUpdate(prevpProps, prevState) {
    //     if (this.state.postList !== prevState.postList) {
    //         setInterval(() => {
    //             getPosts(this);
    //         }, 5000)
    //     }
    // }



    render() {
        const { app } = this.props

        return (
            <div>
                {/* <Button onClick={() => getPosts(this)}> Get Post</Button> */}
                <NewPostForm community={this} />
                <SearchBox handleInput={this.handleInput} />
                {!this.state.searched && (<PostList posts={this.state.postList}
                    permission={app.state.isAdmin} />)}
                {this.state.searched && (<PostList posts={this.state.filteredPost}
                    permission={app.state.isAdmin} />)}
            </div>
        );
    }
}

export default Community;
