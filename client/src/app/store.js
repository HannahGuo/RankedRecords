import { configureStore } from '@reduxjs/toolkit'
import artistlist from '../features/artistlist'
  
export default configureStore({
	reducer: {
		artistList: artistlist
	}
})