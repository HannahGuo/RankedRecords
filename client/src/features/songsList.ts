import {
	PayloadAction,
	createSlice
} from '@reduxjs/toolkit'

export enum LoadingStages {
	ALBUMS = "albums",
	TRACKS = "tracks",
	TRACKS_POP = "tracks_pop"
}

export const songsSlice = createSlice({
	name: 'songsList',
	initialState: {
		// an object of objects where it goes [artist id]: [songs]
		sList: {},
		isLoading: false,
		loadingStages: {
			// [current, total]
			"albums": 0,
			"tracks": 0,
			"tracks_pop": 0
		}
	},
	reducers: {
		addLoadingArtist: (state, action: PayloadAction < string > ) => {
			state.sList[action.payload] = [];
		},

		addArtistSongs: (state, action: PayloadAction < [string, SongObj[]] > ) => {
			state.sList[action.payload[0]] = action.payload[1];
		},
		removeArtistSongs: (state, action: PayloadAction<string>) => {
			delete state.sList[action.payload];
		},
		setLoadingStatus: (state, action:PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
		updateLoadingStatus: (state, action:PayloadAction<[string, Number]>) => {	
			state.loadingStages[action.payload[0]] = action.payload[1];
		},
		resetLoadingTotals: (state) => {
			state.loadingStages = {
				"albums": 0,
				"tracks": 0,
				"tracks_pop": 0
			}
		}
	},
})

export const {
	addArtistSongs,
	removeArtistSongs,
	addLoadingArtist,
	setLoadingStatus,
	updateLoadingStatus,
	resetLoadingTotals
} = songsSlice.actions
export default songsSlice.reducer