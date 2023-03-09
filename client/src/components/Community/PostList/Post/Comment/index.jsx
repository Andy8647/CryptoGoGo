import React from "react";
import { uid } from "react-uid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";

import PostComment from "./PostComment";

class CommentList extends React.Component {
    render() {
      const { postID, comments, permission } = this.props;
  
      /* Our student list.  We use the state to iterate through the 
         student list and make an <li> for each one. */
      return (
        <Table className="comment-list">
          <TableBody>
            {comments.map(comment => (
              <PostComment
                postID={postID}
                comment={comment}
                permission={permission}
              />
            ))}
          </TableBody>
        </Table>
      );
    }
  }
  
  export default CommentList;