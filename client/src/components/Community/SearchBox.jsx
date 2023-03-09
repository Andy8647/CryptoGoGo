import { TextField, withStyles } from '@material-ui/core';
import React, { Component } from 'react';


const useStyles = theme => ({
    searchbar: {
        minWidth: 400,
        maxWidth: 400,
    },
});

const classes = useStyles();

class SearchBox extends Component {

    render() {
        const { classes , handleInput} = this.props;

        return (
            <div>
                <TextField 
                className = {classes.searchbar} 
                id="filled-secondary"
                label="Search Post"
                variant="filled"
                autoComplete='off'
                onChange={(handleInput)}
                />               
            </div>
        )
    }

}


export default withStyles(useStyles)(SearchBox);