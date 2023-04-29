import "./styles/RecArtistList.css"
import { useSelector, RootStateOrAny } from 'react-redux'

export default function RecArtistList() {
	const artistListSelector = useSelector((state: RootStateOrAny)  => state.artistList.aList);
    // const artistDispatch = useDispatch();

	// return <div id="selectedArtistListDiv">
	// 		{artistListSelector.length === 0 ? <div id="noArtistDiv">No artists selected, use search above to add some!</div> : null}
	// 		{artistListSelector.map((val: ArtistObj) => {
	// 			let curArtistObj = val[0];
	// 			return <div key={curArtistObj.key} className="artistDiv">
	// 					<img src={curArtistObj.image.src}/>
	// 					<span>{curArtistObj.name}</span>
	// 					<Button basic icon circular={true} compact={true} 
	// 							onClick={() => { 
	// 								artistDispatch(removeArtist(curArtistObj))
	// 								artistDispatch(removeArtistSongs(curArtistObj.id))
	// 							}}
	// 							>
	// 						<Icon name="remove"/>
	// 					</Button>
	// 				</div>
	// 		}
	// 	)
	// }
	// </div>;
	return <div id="recArtistListDiv">
		{artistListSelector.length === 0 ? <div id="noArtistDiv"><em>Add artists to see recommendations!</em></div> : null}
	</div>
}