import ArtistList from './ArtistList';
import './styles/ArtistBox.css';

export default function ArtistBox() {  
	return <div id="artistBoxDiv" className="border-gradiant">
		<h2>Current Artists</h2>
		<ArtistList/>
	</div>
}