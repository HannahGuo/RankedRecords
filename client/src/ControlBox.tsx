import './styles/ControlBox.css';
import SearchBar from './SearchBar';

export default function ControlBox() {  
	return <div id="controlBoxDiv">
		<div id="searchAndButtonsDiv">
			<SearchBar/>
			<div id="controlButtonsDiv">
				<div className="buttonDark">Options</div>
				<div className="buttonDark">Create Playlist</div>
			</div>
		</div>
	</div>
}