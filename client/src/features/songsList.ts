import {
	createSlice
  } from '@reduxjs/toolkit'
  
  export const songsSlice = createSlice({
	name: 'songsList',
	initialState: {
	  sList: [],
	},
	reducers: {
	  addArtistSongs: (state, action) => {
		// Prevent duplicates
		let artistIndex = state.sList.findIndex(x => x[0].key === action.payload[0].key);
	  },
	  removeArtistSongs: (state, action) => {

	  }
	},
  })
  
  export const {

  } = songsSlice.actions
  export default songsSlice.reducer