import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPostById, useDeletePostMutation, useUpdatePostMutation } from "./postSlice";

import { useParams, useNavigate } from "react-router-dom";

import { selectAllUsers } from "../users/userSlice";

import React from "react";

const EditPostForm = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [updatePost, {isLoading}] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const post = useSelector((state) => selectPostById(state, Number(postId)));
  const users = useSelector(selectAllUsers);

  const [title, setTitle] = useState(post?.title);
  const [content, setContent] = useState(post?.body);
  const [userId, setUserId] = useState(post?.userId);


  if (!post) {
    return (
      <section>
        <h2>Post Not Found</h2>
      </section>
    );
  }

  const onTitleChange = (e) => setTitle(e.target.value);
  const onContentChange = (e) => setContent(e.target.value);
  const onUserChange = (e) => setUserId(Number(e.target.value));

  const canSave =
    [title, content, userId].every(Boolean) && !isLoading;

  const onSavePostClicked = async() => {
    if (canSave) {
      console.log({
        id: post.id,
        title,
        body: content,
        userId,
        reactions: post.reactions,
      });
      try {
        await
          updatePost({
            id: post.id,
            title,
            body: content,
            userId,
            reactions: post.reactions,
          })
        .unwrap();

        setTitle("");
        setContent("");
        setUserId("");
        navigate("/post/" + postId);
      } catch (error) {
        console.log("failed to update post", error);
      } 
    }
  };

  const onDeletePostClicked = async() => {
    try {
      await
        deletePost({
          id: post.id,
        })
      .unwrap();

      setTitle("");
      setContent("");
      setUserId("");
      navigate("/");
    } catch (error) {
      console.log("failed to delete the post", error);
    } 
  };

  const usersOptions = users?.map((user) => (
    <option value={user.id} key={user.id}>
      {user.name}
    </option>
  ));

  return (
    <section>
      <h2>Edit Post</h2>
      <form className="form">
        <label htmlFor="title">Post Title: </label>
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
          defaultValue={userId}
          onChange={onUserChange}
          className="form-select"
        >
          <option value=""></option>
          {usersOptions}
        </select>
        <br />
        <label htmlFor="postcontent">Content</label>
        <br />
        <textarea
          id="postcontent"
          name="postcontent"
          value={content}
          onChange={onContentChange}
          maxLength={300}
          className="form-textarea"
        />
        <br />
       
          <button
            type="button"
            onClick={onSavePostClicked}
            className="form-button-save"
            disabled={!canSave}
          >
            Save Post
          </button> <br />
          <button
            type="button"
            onClick={onDeletePostClicked}
            className="form-button-delete"
          >
            Delete Post
          </button>
   
      </form>
    </section>
  );
};

export default EditPostForm;
