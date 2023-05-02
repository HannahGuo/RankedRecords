import { Table } from 'semantic-ui-react'
import "./styles/SongTable.css"
import useToSortSongs from "./hooks/useToSortSongs";
import {useSelector, useDispatch} from "react-redux";
import { ListSettings, toggleSortDirection } from './features/listSettings';
import { PopularityTip } from './PopularityTip';

export default function SongTable() {
  const listSettings : ListSettings = useSelector((state: any) => state.listSettings);
	const allSongs = useToSortSongs();
  const dispatch = useDispatch();

return <Table celled padded id="customTable" sortable>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell sorted={listSettings.sortDirection}
          onClick={() => dispatch(toggleSortDirection())}
          width={3}
          >
          {
           listSettings.sortMethod === "popularity" 
           ? <>Popularity <PopularityTip/></> : 
            <>Release Date<br/>(YYYY-MM-DD)</>
          }
        </Table.HeaderCell>
        <Table.HeaderCell width={7}>Song Name</Table.HeaderCell>
        <Table.HeaderCell width={4}>Artist(s)</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body key={`songtablewith ${allSongs.length}`}>
      {allSongs.map(((songEntry: SongObj) => {
        return <Table.Row key={songEntry.duration_ms + songEntry.name}>
        <Table.Cell>
            {listSettings.sortMethod === "popularity" ? 
            songEntry.popularity : 
            songEntry.release_date}
        </Table.Cell>
        <Table.Cell>
          <a href={songEntry.ext_spotify_url} target="_blank" rel="noreferrer">{songEntry.name}</a>
        </Table.Cell>
        <Table.Cell>
          {songEntry.artists.map((artist : SpotifyArtistObj) => {
            return <a key={`artistLink for ${artist.name} for song ${songEntry.name}`}
                      href={artist.external_urls.spotify} target="_blank" rel="noreferrer">{artist.name}</a>;
          }).reduce((prev: String, curr: String) => [prev, ', ', curr])}
        </Table.Cell>
      </Table.Row>
      }))}
      
    </Table.Body>
  </Table>
}