import {
	createSlice
  } from '@reduxjs/toolkit'
  
  export const songsSlice = createSlice({
	name: 'songsList',
	initialState: {
	// an object of objects where it goes [artist id]: [songs]
	  sList: {},
	},
	reducers: {
	  addLoadingArtist: (state, action) => {
		state.sList[action.payload] = [];
	  },

	  addArtistSongs: (state, action) => {
		state.sList[action.payload[0]] = action.payload[1];
	  },
	  removeArtistSongs: (state, action) => {
		delete state.sList[action.payload];
	  }
	},
  })
  
  export const {
	addArtistSongs,
	removeArtistSongs,
	addLoadingArtist
  } = songsSlice.actions
  export default songsSlice.reducer