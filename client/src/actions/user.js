export const login = (loginComp, app) => {
    // Create our request constructor with all the parameters we need
    const request = new Request(`api/users/login`, {
        method: "post",
        body: JSON.stringify(loginComp.state),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });

    // Send the request with fetch()
    fetch(request)
        .then(res => {
            if (res.status === 200) {
                window.location.pathname = '/'
                return res.json();
            } else {
                alert("Wrong Username or Password!")
                console.log("fail to log in")
            }
        })
        .then(json => {
            if (json.currentUser !== undefined) {
                app.setState({ currentUser: json.currentUser, isAdmin: json.isAdmin, loginStatus:true });
                //window.location.pathname = '/community'
            }
        })
        .catch(error => {
            console.log(error);
        });
};

export const logout = (app) => {
    const url = `api/users/logout`;

    fetch(url)
        .then(res => {
            app.setState({
                currentUser: null,
                isAdmin:false,
                loginStatus:false,
                message: { type: "", body: "" }
            });
        })
        .catch(error => {
            console.log(error);
        });
};

export const checkSession = (app) => {
    const url = `users/check-session`;

    fetch(url)
    .then(res => {
        if (res.status === 200) {
            return res.json();
        }
    })
    .then(json => {
        if (json && json.currentUser) {
            app.setState({ currentUser: json.currentUser, isAdmin: json.isAdmin, loginStatus:true });
        }
    })
    .catch(error => {
        console.log(error);
    });

    
};

export const signup = (signupComp) => {
    let response = [];
    // Create our request constructor with all the parameters we need
    const request = new Request(`api/users`, {
        method: "post",
        body: JSON.stringify(signupComp),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });

    // Send the request with fetch()
    fetch(request)
        .then(res => {
            if (res.status === 200) {
                // window.location.pathname = '/sign-in'
                console.log("sign up successfully!")
                return res.json();
            } else {
                alert("Username or Email already exists!")
                console.log("fail to sign up")
            }
        })
        // .then(json => {
        //     if (json.currentUser !== undefined) {
        //         app.setState({ currentUser: json.currentUser, isAdmin: json.isAdmin });
        //         //window.location.pathname = '/community'
        //     }
        // })
        .catch(error => {
            console.log(error);
        });
};

export const autologin = (loginComp, app) => {
    // Create our request constructor with all the parameters we need
    const request = new Request(`api/users/login`, {
        method: "post",
        body: JSON.stringify(loginComp),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });

    // Send the request with fetch()
    fetch(request)
        .then(res => {
            if (res.status === 200) {
                window.location.pathname = '/'
                return res.json();
            } else {
                alert("Wrong Username or Password!")
                console.log("fail to log in")
            }
        })
        .then(json => {
            if (json.currentUser !== undefined) {
                app.setState({ currentUser: json.currentUser, isAdmin: json.isAdmin, loginStatus:true });
                //window.location.pathname = '/community'
            }
        })
        .catch(error => {
            console.log(error);
        });
};