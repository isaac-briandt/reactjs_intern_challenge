import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";
import { toast } from "react-toastify";

export const login = createAsyncThunk(
  "auth/login",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axios.post("/user/login", params);

      if ("token" in data) {
        window.localStorage.setItem("token", data.token);
        await dispatch(account());
      }

      return data;
    } catch (error) {
      if (error.response?.status === 400) {
        if (error.response?.data.message) {
          return rejectWithValue(error.response?.data.message);
        }
        return rejectWithValue(error.response?.data);
      }
      rejectWithValue("Oops something went wrong!");
      throw (
        error.response?.data.message ??
        "An error occurred signing up. Please try again."
      );
    }
  }
);


export const account = createAsyncThunk("auth/account", async () => {
  try {
    const { data } = await axios.get("/user/account");
    return data;
  } catch (error) {
    toast.error(error ?? "An error occured!");
  }
});

const initialState = {
  data: null,
  status: "",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.data = null;
        state.status = "loading";
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "error";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "success";
      })
      .addCase(account.pending, (state) => {
        state.data = null;
        state.status = "loading";
      })
      .addCase(account.rejected, (state) => {
        state.data = null;
        state.status = "error";
      })
      .addCase(account.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "success";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
