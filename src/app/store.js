import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../features/auth/authSlice"
import todosReducer from "../features/auth/todoSlice"


export default configureStore({
  reducer: {
    auth: authReducer,
    todos: todosReducer
  },
})