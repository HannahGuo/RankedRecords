import "./styles/ArtistList.css"
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux'
import { Icon, Button } from "semantic-ui-react";
import { removeArtist } from "./features/artistList";

export default function ArtistList() {
	const artistListSelector = useSelector((state: RootStateOrAny)  => state.artistList.aList);
    const artistDispatch = useDispatch();

	return <div id="selectedArtistListDiv">
			{artistListSelector.map((val) => {
				let curArtistObj = val[0];
				return <div key={curArtistObj.key} className="artistDiv">
						<img src={curArtistObj.image.src}/>
						<span>{curArtistObj.text}</span>
						<Button basic icon circular={true} compact={true} 
								onClick={() => artistDispatch(removeArtist(curArtistObj))}
								>
							<Icon name="remove"/>
						</Button>
					</div>
			}
		)
	}
	</div>;
}