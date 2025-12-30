import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import { likeAndUnlikePost } from "./postSlice";

export const getFeedData = createAsyncThunk(
  "user/getFeedData",
  async () => {
    try {
      const response = await axiosClient.get("/user/getFeedData");
      return response.result;
    } catch (error) {
      return Promise.reject(error);
    } 
  }
);

export const followAndUnfollowUser = createAsyncThunk(
  "user/followAndUnfollow",
  async (body, thunkAPI) => {
     try {
      const response = await axiosClient.post("/user/follow", body);
      // After successful follow/unfollow, refetch feed data to update posts
      thunkAPI.dispatch(getFeedData());
      return response.result.user;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

const feedSlice = createSlice({
  name: "feedSlice",
  initialState: {
    feedData: {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeedData.fulfilled, (state, action) => {
        state.feedData = action.payload;
      })
      .addCase(likeAndUnlikePost.fulfilled, (state, action) => {
        const post = action.payload;

        const index = state?.feedData?.posts?.findIndex(
          (item) => item._id === post._id
        );
        console.log("feed like", post, index);

        if (index != undefined && index != -1) {
          state.feedData.posts[index] = post;
        }
      })
      .addCase(followAndUnfollowUser.fulfilled, (state, action) => {
        const user = action.payload;
        const followingIndex = state?.feedData?.followings?.findIndex(item => item._id == user._id)
        const suggestionIndex = state?.feedData?.suggestions?.findIndex(item => item._id == user._id)
        if(followingIndex != -1) {
          // Was following, now unfollow: remove from followings, add to suggestions
          state?.feedData?.followings?.splice(followingIndex, 1);
          if(suggestionIndex == -1) {
            state?.feedData?.suggestions?.push(user);
          }
        }else{
          // Was not following, now follow: add to followings, remove from suggestions
          state?.feedData?.followings?.push(user);
          if(suggestionIndex != -1) {
            state?.feedData?.suggestions?.splice(suggestionIndex, 1);
          }
        }
      })
  },
});

export default feedSlice.reducer;
