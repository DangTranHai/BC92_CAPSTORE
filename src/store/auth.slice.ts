import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authService } from "../services/auth.service";
import type {
  AuthData,
  SignInRequest,
  SignUpRequest,
  User,
} from "../types/auth.type";

type AuthState = {
  loading: boolean;
  data: AuthData | null;
  error: string | null;
};

const initialState: AuthState = {
  loading: false,
  data: authService.getCurrentUser(),
  error: null,
};

export const login = createAsyncThunk<AuthData, SignInRequest, { rejectValue: string }>(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      return await authService.signIn(payload);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Đăng nhập thất bại";
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk<User, SignUpRequest, { rejectValue: string }>(
  "auth/registerUser",
  async (payload, { rejectWithValue }) => {
    try {
      return await authService.signUp(payload);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Đăng ký thất bại";
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      authService.signOut();
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.data = null;
      state.error = action.payload || "Đăng nhập thất bại";
    });

    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Đăng ký thất bại";
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;