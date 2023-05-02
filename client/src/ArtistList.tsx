import "./styles/ArtistList.css"
import { useSelector, useDispatch} from 'react-redux'
import { Icon, Button, Popup } from "semantic-ui-react";
import { removeArtist } from "./features/artistList";
import { LoadingStages, removeArtistSongs } from "./features/songsList";
import useToSortSongs from "./hooks/useToSortSongs";

export default function ArtistList() {
	const artistListSelector = useSelector((state: any)  => state.artistList.aList);
	const songsListSelector = useSelector((state: any) => state.songsList.sList);
    const artistDispatch = useDispatch();

	const allSongs = useToSortSongs();

	const loadingStats = useSelector((state: any) => state.songsList.loadingStages);

	return <div id="selectedArtistListDiv" className="artistListDiv">
			{artistListSelector.length === 0 ? <div id="noArtistDiv"><em>No artists selected, use search above to add some!</em></div> : null}
			{artistListSelector.map((val: ArtistObj) => {
				return <div key={val.key} className="artistDiv">
						<img src={val.image.src}/>
						<span className="artistName">{val.name}</span>

						{songsListSelector[val.id] != null && 
						songsListSelector[val.id].length > 0 ? 
							<><span>({
								allSongs.reduce((accumulator, song) => {
									return song.artists.some((artist: SpotifyArtistObj) => 
											artist.name === val.name) ? accumulator + 1 : accumulator;
								  }, 0)								  
								} songs)</span>
							<Button basic icon circular={true} compact={true} 
									onClick={() => { 
										artistDispatch(removeArtist(val.id))
										artistDispatch(removeArtistSongs(val.id))
									}}
									>
								<Icon name="remove"/>
							</Button>
							</>
							: <Button basic icon circular={true} compact={true} className="normalPointer">
								<Popup
									trigger={<Icon className="normalPointer" loading name='spinner' />}
									content={`Loading all songs... this may take a few seconds.
									Albums found: ${loadingStats[LoadingStages.ALBUMS]}, 
									Albums loaded: ${loadingStats[LoadingStages.TRACKS]}, 
									Songs loaded: ${loadingStats[LoadingStages.TRACKS_POP]}`}
									position='right center'
									inverted
								/>
							</Button>
						}
					</div>
			}
		)
	}
	</div>;
}