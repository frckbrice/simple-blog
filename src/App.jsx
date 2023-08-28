import { useState } from "react";
import "./App.css";
import PostsList from "./feature/post/postsList";
import useTitle from "./feature/useTitle";
import NewPostForm from "./feature/post/NewPostForm";

function App() {
  useTitle("rtk-lesson3");
  return (
    <main className="app">
      <NewPostForm />
      <PostsList />
    </main>
  );
}

export default App;
