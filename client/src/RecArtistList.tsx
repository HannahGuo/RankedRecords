import { useEffect, useState } from "react";
import "./styles/ArtistList.css"
import { useSelector, RootStateOrAny, useDispatch } from 'react-redux'
import { spotifyApi } from "./constants";
import { Button, Icon } from "semantic-ui-react";
import { addtoEnd, updateArtistID } from "./features/artistList";

export default function RecArtistList() {
	const artistListSelector = useSelector((state: RootStateOrAny)  => state.artistList.aList);
	const [numArtists, setNumArtists] = useState(0);
	const [artistRecs, setArtistRecs] = useState({});
	const dispatch = useDispatch();

	useEffect(() => {
		// new artist was added
		if (artistListSelector.length > numArtists) {
			const newArtist = artistListSelector[artistListSelector.length - 1];
		
			// Create a copy of artistRecs
			let updatedArtistRecs = { ...artistRecs };
		
			// Remove the new artist from previous artist's recommendations
			Object.keys(artistRecs).forEach((recID: any) => {
			  let artistMap = artistRecs[recID].map((val: any) => val.id);
			  if (artistMap.includes(newArtist.id)) {
				let newArr = artistRecs[recID].filter((val: any) => val.id !== newArtist.id);
				updatedArtistRecs[recID] = newArr;
			  }
			});
		
			spotifyApi.getArtistRelatedArtists(newArtist.id).then((data) => {
			  let artistListIDs = artistListSelector.map((val: ArtistObj) => val.id);
			  let artistRecIds = Object.values(updatedArtistRecs).flatMap((val: any[]) =>
				val.map((artist: ArtistObj) => artist.id),
			  );
		
			  let recs = data.body.artists
				.filter((val: SpotifyArtistObj) => {
				  return !artistListIDs.includes(val.id) && !artistRecIds.includes(val.id);
				})
				.slice(0, 5);
		
			  recs = recs.map((val: any) => {
				const imageUrl = val.images && val.images.length > 0 ? val.images[0].url : '';
				return { ...val, key: val.id + val.name, value: val.id, image: { src: imageUrl } };
			  });
		
			  // Combine the removal of new artist from previous artist's recommendations and setting recommendations for the new artist
			  setArtistRecs({ ...updatedArtistRecs, [newArtist.id]: recs });
			}).catch((err: SpotifyResponse) => {
			  console.log(err);
			});
			
		} else if(artistListSelector.length < numArtists) {
			// artist was removed
			const artistRecKeys = Object.keys(artistRecs);
			const curArtists = artistListSelector.map((val: any) => val[0].id);
			for(let i = 0; i < artistRecKeys.length; i++) {
				if(!curArtists.includes(artistRecKeys[i])) {
					delete artistRecs[artistRecKeys[i]];
				}
			}
		}

		setNumArtists(artistListSelector.length);
	}, [artistListSelector])

	return <div id="recArtistListDiv" className="artistListDiv">
		{artistListSelector.length === 0 ? <div id="noArtistDiv"><em>Add artists to see recommendations!</em></div> : null}

		{artistListSelector.length == 0 ? <></> : 
		(Object.keys(artistRecs)).map((recID: any) => {
				let curArtistRecs = artistRecs[recID];
				return curArtistRecs.map((curArtistObj: ArtistObj) => {
					return <div key={curArtistObj.key} className="artistDiv">
							<img src={curArtistObj.image.src}/>
							<span className="artistName greyName">{curArtistObj.name}</span>
							<Button basic icon circular={true} compact={true} 
									onClick={() => {
										dispatch(addtoEnd(curArtistObj));
										dispatch(updateArtistID(curArtistObj.id));
									}}>
								<Icon name="add"/>
							</Button>
						</div>
				})
			}
		)
	}
	</div>
}