import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { localAuthService } from "../services/local-auth.service";
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
  data: localAuthService.getCurrentAuth(),
  error: null,
};

export const login = createAsyncThunk<
  AuthData,
  SignInRequest,
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    return await localAuthService.signIn(payload);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Đăng nhập thất bại";
    return rejectWithValue(message);
  }
});

export const registerUser = createAsyncThunk<
  User,
  SignUpRequest,
  { rejectValue: string }
>("auth/registerUser", async (payload, { rejectWithValue }) => {
  try {
    return await localAuthService.signUp(payload);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Đăng ký thất bại";
    return rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localAuthService.logout();
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
      state.error = null;
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
      state.error = null;
    });

    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Đăng ký thất bại";
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;