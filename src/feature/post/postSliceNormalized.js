import {
  createSlice,
  createAsyncThunk,
  createSelector,
  createEntityAdapter
} from "@reduxjs/toolkit";
import { sub } from "date-fns";
import axios from "axios";

//* the benefit of normalizing the state is to make the state less complicated to manage as it abstracts  

const POST_URL = "http://jsonplaceholder.typicode.com/posts";

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})
// the state is already part of the adapter. the is extre state we just add on top of that.
const initialState = postsAdapter.getInitialState({
  status: "idle", // 'idle'|'loading' | 'succeeded' | 'failed'
  error: null,
  count: 0
});

export const fetchPosts = createAsyncThunk(
  "post/fetchPosts",
  async function () {
    const response = await axios.get(POST_URL);
    console.log(response.data);
    return response.data;
  }
);

export const addNewPost = createAsyncThunk(
  "post/addNewPost",
  async (initialPost) => {
    try {
      const response = await axios.post(POST_URL, initialPost);
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }
);

export const updatePost = createAsyncThunk(
  "post/udatePost",
  async (initialPost) => {
    // console.log(initialPost);
    const { id } = initialPost;
    try {
      const response = await axios.put(`${POST_URL}/${id}`, initialPost);
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error?.message);
      return initialPost; // this only for testing rdux
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (initialPost) => {
    const { id } = initialPost;
    try {
      const response = await axios.delete(`${POST_URL}/${id}`);
      // this case is only for typicode.com. it doesn't return the object deleted.
      if (response.status === 200) return initialPost;
      return `${response?.status}: ${response?.statusText}`;
    } catch (error) {
      return error?.message;
    }
  }
);
 console.log("before postSliceNormalize createSlice");
export const postSliceNormalized = createSlice({
  name: "posts",
  initialState,

  reducers: {
    
    reactionAdded: (state, action) => {
      const { postId, reaction } = action.payload;
      const existingPost = state.entities[postId];
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
    increaseCount: (state, action) => {
      state.count++;
    },
  },
  extraReducers: (builder) => {
     
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload);
        console.log(state.posts);
        // adding date and reactions
        let min = 1;
        const loadedPosts = action.payload?.map((post) => {
          post.date = sub(new Date(), { minutes: min++ }).toISOString();
          post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          };
          return post;
        }); 
        
        postsAdapter.upsertMany(state, loadedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        action.payload.userId = Number(action.payload?.userId);

        action.payload.date = new Date().toISOString();
        action.payload.reactions = {
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0,
        };
        // to avoid duplicate key warning in map
        action.payload.id = new Date().toISOString();

        console.log(action.payload);
        postsAdapter.addOne(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("update can not be completed");
          console.log(action.payload);
          return;
        }
        action.payload.date = new Date().toISOString();
        postsAdapter.upsertOne(action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("delete can not be completed");
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        postsAdapter.removeOne(state, id);
      });
  },
});


export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
export const getCount = (state) => state.posts.count;

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  //pass in a selector that return the posts slice of state.
} = postsAdapter.getSelectors((state) => state.posts);

export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter((post) => post.userId === userId)
);

export const { reactionAdded, increaseCount } = postSliceNormalized.actions;
export default postSliceNormalized.reducer;
