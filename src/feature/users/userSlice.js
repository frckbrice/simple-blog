import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';


//* no more need static data
// const initialState = [
//   { id: "1", name: "maebrie" },
//   { id: "2", name: "avom" },
//   { id: "3", name: "brice" },
// ];

const POST_URL = "http://jsonplaceholder.typicode.com/users";

const initialState = [];

export const fetchUsers = createAsyncThunk('post/fetchUsers', async() => {
  const response = await axios(POST_URL);
  return response.data;
})

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(fetchUsers.fulfilled, (state, action) => {
          return action.payload // we override the state instead of concatenating
        })
  }
});

export const selectAllUsers = (state) => state.users;

export const selectUserById = (state, userId) => state.users.find(user => user.id === userId);

export default usersSlice.reducer;