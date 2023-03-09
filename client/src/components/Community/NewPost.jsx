import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Form } from "antd";
import "antd/dist/antd.css";
import { withStyles } from "@material-ui/core";
import { addPost } from "./actions/stack"

const FormItem = Form.Item;

const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],
    ["link", "image"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean"], // remove formatting button
  ],
};

const formats = [
  "header",
  "font",
  "background",
  "color",
  "code",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "script",
  "align",
  "direction",
  "link",
  "image",
  "code-block",
  "formula",
  "video",
];

const useStyles = (theme) => ({
  newpost: {
    maxWidth: 400,
    minWidth: 400,
    marginTop: 5,
    marginBottom: 5,
  },
});

const classes = useStyles();


class NewPostForm extends Component {
  constructor(props) {
    super(props)
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
  };
  state = { title: "", content: "", username: "", open: false };

  handleClickOpen = () => {
    this.setState({ open: true })
  };

  handleClose = () => {
    this.setState({ open: false })
  };

  handleSubmit = () => {
    if (this.state.title.trim() !== "" && this.state.content.trim() !== "") {
      addPost(this)
      this.setState({
        title: "",
        content: "",
        open: false
      })
    } else {
      alert('You cannot create a blank post!')
    }
  }

  handleInputChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  };

  onValueChange = (content) => {
    this.setState({
      content
    })
  }


  render() {
    const { classes } = this.props;

    return (
      <div>
        <Button
          variant="contained"
          color="primary"
          className={classes.newpost}
          onClick={this.handleClickOpen}
        >
          Create New Post
        </Button>
        <Dialog
          fullWidth={1000}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">New Post</DialogTitle>
          <DialogContent>
            <TextField
              required
              autoFocus
              margin="dense"
              name="title"
              label="Title"
              variant="outlined"
              value={this.state.title}
              onChange={this.handleInputChange}
              fullWidth
            />
            <Form style={{ minHeight: 400 }}>
              <ReactQuill
                style={{ height: 300 }}
                value={this.state.content}
                theme="snow"
                modules={modules}
                formats={formats}
                onChange={this.onValueChange}
              />
            </Form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(useStyles)(NewPostForm);
