import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import { fetchUsers } from "./feature/users/userSlice.js";
import { extendedApiSlice } from "./feature/post/postSlice.js";
import {createBrowserRouter, RouterProvider, Navigate} from 'react-router-dom';
import Layout  from "./components/Layout.jsx";
import PostsList from "./feature/post/postsList.jsx";
import Errorpage from "./components/Errorpage.jsx";
import NewPostForm from "./feature/post/NewPostForm.jsx";
import SinglePagePost from "./feature/post/SinglePagePost.jsx";
import EditPostForm from "./feature/post/EditPostPage.jsx";
import UserList from "./feature/users/UserList.jsx";
import UserPage from "./feature/users/UserPage.jsx";

const route = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Errorpage />,

    children: [
      {
        errorElement: <Errorpage />,
        children: [
          {
            index: true,
            element: <PostsList />,
          },
          {
            path: "post",
            children: [
              {
                index: true,
                element: <NewPostForm />,
              },
              {
                path: ":postId",
                element: <SinglePagePost />,
              },
              {
                path: "edit/:postId",
                element: <EditPostForm />,
              },
            ],
          },
          {
            path: "users",
            children: [
              {
                index: true,
                element: <UserList />,
              },
              {
                path: ":userId",
                element: <UserPage />,
              },
            ],
          },
          {//catch all unknown route. replace with This could be replace by 404 page component if wanted.
            path: "*",
            element: <Navigate to ='/' replace />,
          },
        ],
      },
    ],
  },
]);

// we can now initiate manually the fetch of data
store.dispatch(extendedApiSlice.endpoints.getPosts.initiate());
store.dispatch(fetchUsers());


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={route} />
    </Provider>
  </React.StrictMode>
);
