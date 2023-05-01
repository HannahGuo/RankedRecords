import { SortMethod, SortDirection } from "../features/listSettings";
import {useSelector} from "react-redux";

export default function useToSortSongs() {
	const listSettings = useSelector((state: any) => state.listSettings);
	const curSongList : Object = useSelector((state: any) => state.songsList.sList);

	let songsList = Object.values(curSongList).flat();

	const curSortMethod: SortMethod = listSettings.sortMethod;
	const curSortDirection: SortDirection = listSettings.sortDirection;
	const curFilters: String[] = listSettings.filterOptions;

	// first use user specified filters
	songsList = songsList.filter((song: SongObj) => {
		if (curFilters.length === 0) {
			return true;
		} else {
			return !curFilters.some((fil: string) =>
				song.name.toLowerCase().includes(fil.toLowerCase())
			);
		}
	});

	// filter out duplicates (this is the case when we select multiple artists on the same song)
	songsList = songsList.filter((song: SongObj, index: number, self: SongObj[]) =>
		index === self.findIndex((t: SongObj) => (
			t.name === song.name && t.duration_ms === song.duration_ms
		))
	);
	  
	switch(curSortMethod) {
		case SortMethod.POPULARITY:
			switch(curSortDirection) {
				case SortDirection.ASCENDING:
					songsList.sort((a: SongObj, b: SongObj) => {
						return a.popularity - b.popularity;
					});
					break;
				case SortDirection.DESCENDING:
					songsList.sort((a: SongObj, b: SongObj) => {
						return b.popularity - a.popularity;
					});
					break;
			}
			break;
		case SortMethod.CHRONOLOGY:
			switch(curSortDirection) {
				case SortDirection.ASCENDING:
					// Old songs first
					songsList.sort((a: SongObj, b: SongObj) => {
						return Date.parse(a.release_date) - Date.parse(b.release_date);
					});
					break;
				case SortDirection.DESCENDING:
					// New songs first
					songsList.sort((a: SongObj, b: SongObj) => {
						return Date.parse(b.release_date) - Date.parse(a.release_date);
					});
					break;
			}
			break;
	}

	return songsList;
}