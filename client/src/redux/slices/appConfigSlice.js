import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import { removeItem, KEY_ACCESS_TOKEN } from "../../utils/localStorageManager";

export const getMyInfo = createAsyncThunk(
  "user/getMyInfo",
  async () => {
    try {
      // thunkAPI.dispatch(setLoading(true));
      const response = await axiosClient.get("/user/getMyInfo");
      // console.log("app is loaded", response);
      return response.result;
    } catch (error) {
      return Promise.reject(error);
    } 
  }
);

export const updateMyProfile = createAsyncThunk(
  "user/updateMyProfile",
  async (body) => {
    try {
      const response = await axiosClient.put("/user/", body);
      return response.result;
    }catch(error) {
      return Promise.reject(error)
    } });

export const deleteMyProfile = createAsyncThunk(
  "user/deleteMyProfile",
  async () => {
    try {
      const response = await axiosClient.delete("/user/");
      // On success, remove token and redirect
      removeItem(KEY_ACCESS_TOKEN);
      window.location.replace("/login", "_self");
      return response.result;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

const appConfigSlice = createSlice({
  name: "appConfigSlice",
  initialState: {
    isLoading: false,
    toastData: {},
    myProfile: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    showToast: (state, action) => {
      state.toastData = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getMyInfo.fulfilled, (state, action) => {
      state.myProfile = action.payload.user;
    })
    .addCase(getMyInfo.rejected, (state, action) => {
      console.error("Failed to load user info:", action.error);
    })
    .addCase(updateMyProfile.fulfilled, (state, action) => {
      state.myProfile = action.payload.user;
    })
    .addCase(updateMyProfile.rejected, (state, action) => {
      console.error("Failed to update profile:", action.error);
    });
  },
});

export default appConfigSlice.reducer;

export const { setLoading, showToast } = appConfigSlice.actions;
