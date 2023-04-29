import ArtistList from './ArtistList';
import RecArtistList from './RecArtistList';
import './styles/RecArtistBox.css';

export default function RecArtistBox() {  
	return <div id="artistRecDiv">
		<h2>Artist Recommendations</h2>
		<span>Artists similar to your selection. Have an artist suggestion? Click <a href="#">here</a>.</span>
		<RecArtistList/>
	</div>
}