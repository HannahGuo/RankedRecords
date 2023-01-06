import {
	useState
} from 'react';
import {
	useSelector,
	RootStateOrAny
} from 'react-redux'
import useToFetchSongs from './hooks/useToFetchSongs';

export default function SongTable() {
	const artistListSelector = useSelector((state: RootStateOrAny) => state.artistList.aList);
	const songList = useToFetchSongs();
	return <div>Songs</div>;
}