import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import themeReducer from "./themeSlice";
import blogReducer from "./blogSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme:themeReducer,
    blog:blogReducer,
    user:userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;