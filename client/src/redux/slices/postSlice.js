import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import { setLoading } from "./appConfigSlice";

export const getUserProfile = createAsyncThunk(
  "user/getUserProfile",
  async (body) => {
    try {
      const response = await axiosClient.post("/user/getUserProfile", body);
      return response.result;
    } catch (error) {
      return Promise.reject(error);
    } 
  }
);

export const likeAndUnlikePost = createAsyncThunk(
  "/post/likeAndUnlike",
  async (body) => {
    try {
      const response = await axiosClient.post("/posts/like", body);
      return response.result.post;
    } catch (error) {
      return Promise.reject(error);
    } 
  }
);

export const deletePost = createAsyncThunk(
  "/post/delete",
  async (body) => {
    try {
      const response = await axiosClient.delete("/posts/", { data: body });
      return { postId: body.postId };
    } catch (error) {
      return Promise.reject(error);
    } 
  }
);

const postSlice = createSlice({
  name: "postSlice",
  initialState: {
    userProfile: {},
  },
  extraReducers: (builder) => {
    builder.addCase(getUserProfile.fulfilled, (state, action) => {
      state.userProfile = action.payload;
    })
    .addCase(likeAndUnlikePost.fulfilled, (state, action) => {
      const post = action.payload;
      
      const index = state?.userProfile?.posts?.findIndex(item => item._id === post._id);
      console.log('post slice', index);
      if(index != undefined && index != -1) {
        state.userProfile.posts[index] = post;
      }
    })
    .addCase(deletePost.fulfilled, (state, action) => {
      const postId = action.payload.postId;
      const index = state?.userProfile?.posts?.findIndex(item => item._id === postId);
      if (index !== -1) {
        state.userProfile.posts.splice(index, 1);
      }
    })
    .addCase(deletePost.rejected, (state, action) => {
      console.error("Failed to delete post:", action.error);
    })
  },
});

export default postSlice.reducer;
