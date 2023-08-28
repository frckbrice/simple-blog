import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/userSlice";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";

//eslint-disable-next-line
const PostAuthor = ({userId}) => {
  const users = useSelector(selectAllUsers);

  const author = users?.find((user) => user.id === userId);

  return (
    <span style={{ fontSize: "16px" }}>
      &nbsp;&nbsp; By:{" "}
      {author ? (
        <Link to={`/users/${userId}`}>{author.name}</Link>
      ) : (
        "Unknown author"
      )}
    </span>
  );
};

PostAuthor.propTypes = {
  users: PropTypes.arrayOf(Object),
  author: PropTypes.object,
};

//eslint-disable-next-line 
export default React.memo(PostAuthor);
