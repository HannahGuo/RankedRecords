import {
	createSlice
  } from '@reduxjs/toolkit'
  
  export const spotifyUsersSlice = createSlice({
	name: 'spotifyUserSettings',
	initialState: {
	  startAuth: false,
	  accessToken: null, // if this is non-null, successful auth
	  user: null, // user object
	},
	reducers: {
	  setAccessToken: (state, action) => {
		state.accessToken = action.payload;
	  },
	  setUser: (state, action) => {
		state.user = action.payload;
	  },
	  setStartAuth: (state, action) => {
		state.startAuth = action.payload;
	  }
	},
  })
  
  export const {
	setAccessToken,
	setUser,
	setStartAuth
  } = spotifyUsersSlice.actions
  export default spotifyUsersSlice.reducer