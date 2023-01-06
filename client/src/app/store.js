import { configureStore } from '@reduxjs/toolkit'
import artistList from '../features/artistList'
import listSettings from '../features/listSettings'
import songsList from '../features/songsList'

export default configureStore({
	reducer: {
		artistList: artistList,
		listSettings: listSettings,
		songsList: songsList
	}
})