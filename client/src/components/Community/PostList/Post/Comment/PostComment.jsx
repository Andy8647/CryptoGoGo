import React, { Component } from 'react';
import "../styles.css"
import Button from "@material-ui/core/Button";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import moment from 'moment'

import { deleteComment } from '../../../actions/stack'


class PostComment extends Component {
  dateToStr = (date) => {
    const d = moment(date).format('YYYY-MM-DD hh:mm a')
    return d
  }

  render() {
    const { postID, comment, permission} = this.props;

    return (
      <TableRow className="comment" key={comment.author}>
        <TableCell style={{ width: 50 }} component="th" scope="row">
          {comment.username}:
            </TableCell>

        <TableCell component="th" scope="row">
          {comment.commentContent}
        </TableCell>

        <TableCell component="th" scope="row" align="right">
          {this.dateToStr(comment.commentDate)}
        </TableCell>
        {permission && (
        <TableCell component="th" scope="row">
          <Button
            variant="contained"
            onClick={
              () => deleteComment(postID, comment._id)
            }
          >
          Delete
          </Button>
        </TableCell>
        )}

      </TableRow>
    )
  }




}

export default PostComment;