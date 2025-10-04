import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Role = 'ADMIN' | 'USER' | 'OWNER' | null;

interface AuthState {
  token: string | null;
  role: Role;
}

const initialState: AuthState = {
  token: null,
  role: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{ token: string; role: Exclude<Role, null> }>) {
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
    clearAuth(state) {
      state.token = null;
      state.role = null;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;

