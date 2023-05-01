import ArtistList from './ArtistList';
import RecArtistList from './RecArtistList';
import './styles/RecArtistBox.css';

export default function RecArtistBox() {  
	return <div id="artistRecDiv">
		<h2>Artist Recommendations</h2>
		<RecArtistList/>
	</div>
}