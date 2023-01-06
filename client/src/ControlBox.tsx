import './styles/ControlBox.css';
import SearchBar from './SearchBar';
import ArtistList from './ArtistList';

export default function ControlBox() {  
	return <div id="controlBoxDiv">
		<div id="searchAndButtonsDiv">
			<SearchBar/>
			<div id="controlButtonsDiv">
				<div className="buttonDark">Options</div>
				<div className="buttonDark">Create Playlist</div>
			</div>
		</div>
		<div id="artistsListDiv">
			<h3>Current Artists</h3>
			<ArtistList/>
		</div>
	</div>
}