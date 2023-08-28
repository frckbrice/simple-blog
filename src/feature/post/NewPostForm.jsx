import { useState } from "react";
import { useAddNewPostMutation } from "./postSlice";

import PropTypes from "prop-types";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectAllUsers } from "../users/userSlice";

import { useNavigate } from "react-router-dom";

const NewPostForm = () => {

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");

 const [addNewPost, { isLoading }] = useAddNewPostMutation();
  const navigate = useNavigate();

  const users = useSelector(selectAllUsers);

  const onTitleChange = (e) => setTitle(e.target.value);
  const onContentChange = (e) => setContent(e.target.value);
  const onUserChange = (e) => setUserId(Number(e.target.value));

  const canSave =
    [title, content, userId].every(Boolean) && !isLoading;

  const onSavePostClicked = async(e) => {
    e.preventDefault();
    if (canSave) {
      console.log({ title, body: content, userId });
      try {

    await  addNewPost({ title, body: content, userId }).unwrap();
        setContent("");
        setTitle("");
        setUserId("");
        navigate("/");
        console.log({ title, body: content, userId });
      } catch (error) {
        console.log("Error. Failed to save the post: " + error.message);
      }
    }
  };

  const usersOptions = users?.map((user) => (
    <option value={user.id} key={user.id}>
      {user.name}
    </option>
  ));

  return (
    <section>
      <h2>New Post</h2>
      <form className="form">
        <label htmlFor="title">Title</label>
        <br />
        <input
          type="text"
          id="title"
          placeholder="title of the text"
          name="title"
          value={title}
          onChange={onTitleChange}
          className="form-input"
        />
        <br />
        <label htmlFor="author">Author:</label>
        <select
          name="author"
          id="author"
          value={userId}
          onChange={onUserChange}
          className="form-select"
        >
          <option value=""></option>
          {usersOptions}
        </select>
        <br />
        <label htmlFor="content">Content</label>
        <br />
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={onContentChange}
          maxLength={300}
          className="form-textarea"
        />
        <br />
        <button
          type="button"
          onClick={onSavePostClicked}
          className="form-button"
          disabled={!canSave}
        >
          Save Post
        </button>
      </form>
    </section>
  );
};

NewPostForm.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  onTitleChange: PropTypes.func,
  onContentChange: PropTypes.func,
  onSavePostClicked: PropTypes.func,
  canSave: PropTypes.bool,
};

export default NewPostForm;
