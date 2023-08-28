import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../feature/api/apiSlice";
import usersReducer from "../feature/users/userSlice";
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer, // dynamically rename the reducerPath
    users: usersReducer,
  },
  // it is recommended to use middleware here in the store when using RTK-Query and apiSlice.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), // this manage cache lifestime and expires
});
