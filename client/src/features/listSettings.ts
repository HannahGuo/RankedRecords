import {
	createSlice
} from '@reduxjs/toolkit'

export const enum SortMethod {
	POPULARITY = "popularity",
	CHRONOLOGY = "chronology"
}

export const enum SortDirection {
	ASCENDING = "ascending",
	DESCENDING = "descending"
}

interface ListSettings {
	sortMethod: SortMethod,
	sortDirection: SortDirection
}

const initialState: ListSettings = {
	sortMethod: SortMethod.CHRONOLOGY,
	sortDirection: SortDirection.ASCENDING,
}

export const listSettingsSlice = createSlice({
	name: 'listSettings',
	initialState,
	reducers: {
		changeSortMethod: (state, action) => {
			state.sortMethod = action.payload;
		},
		changeSortDirection: (state, action) => {
			state.sortDirection = action.payload;
		},
	},
})

export const {
	changeSortMethod,
	changeSortDirection
} = listSettingsSlice.actions
export default listSettingsSlice.reducer