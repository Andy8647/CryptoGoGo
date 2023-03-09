const log = console.log

/*********** Post API Calls for front-end */

export const addPost = (newPostComp) => {
    // URL for the req
    const url = `/api/posts`;
    // the data to send in req
    const post = newPostComp.state;
    log(post);

    const request = new Request(url, {
        method: "post",
        body: JSON.stringify(post),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });
    log(request)

    // send the request 
    fetch(request)
        .then((res) => {
            if (res.status === 200) {
                // post added successfully
                log("post added")
                window.location.reload()
            } else if(res.status === 413) {
                // too large photo
                alert("file too larger! Limit: 2.5mb")
                log(res.status)
            } else {
                log(res.status)
            }
        }).catch(error => {
            log(error)
        });
}


export const getPosts = async (community) => {
    try {
        const url = `/api/posts`;
        const resp = await fetch(url);
        const posts = await resp.json()
        if (community.state.postList !== posts) {
            console.log("getting post!!!")
            community.setState({
                postList: posts
            })
        }else{
            log("No change")
        }
    } catch (error) {
        log(error)
    }
}


export const searchPost = (kw, posts) => {
    let result = []
    posts.forEach((post) => {
        if (post.title.toLowerCase().search(kw) !== -1 ||
            post.content.toLowerCase().search(kw) !== -1) {
            result.push(post)
        }
    });
    try {
        if (result.length === 0) {
            const noResult = {
                title: "No Result!",
                author: "xxx",
                content: "No result",
                date: "xxx",
                comments: [{
                    username: "xxx",
                    text: "xxx"
                }]
            }
            return [noResult]
        } else {
            return result
        }
    } catch (error) {
        log(error);
    }

}

export const likePost = (postID) => {
    // URL for the req
    const url = `/api/posts/like/` + postID
    // the data to send in req

    const request = new Request(url, {
        method: "post",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });
    fetch(request)
        .then((res) => {
            if (res.status === 200) {
                log("post liked!!")
            } else {
                log(res.status, "link front and back")
            }
        }).catch(error => {
            log(error)
        });
}

export const deletePost = (postID) => {
    const url = 'api/posts/' + postID;
    const request = new Request(url, {
        method: "delete",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    })
    fetch(request).then((res) => {
        if (res.status === 200) {
            log(" post deleted!")
        } else {
            log(res.status)
        }
    }).catch(error => {
        log(error)
    })
}


/*********** comment API Calls for front-end */
// export const getComments = async (postComp) => {
//     const postID = postComp.props.post._id
//     try {
//         const url = "/api/posts/" + postID + "/comments";
//         const resp = await fetch(url);
//         const comments = await resp.json()
//         postComp.setState({
//             comments: comments
//         })
//     } catch (error) {
//         log(error)
//     }
// }

export const deleteComment = (postID, commentID) => {
    const url = 'api/posts/' + postID + '/' + commentID;
    const request = new Request(url, {
        method: "delete",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    })
    fetch(request).then((res) => {
        if (res.status === 200) {
            log(" comment deleted!")
        } else {
            log(res.status)
        }
    }).catch(error => {
        log(error)
    })
}
