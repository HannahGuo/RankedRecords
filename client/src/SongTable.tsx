import { RootStateOrAny, useSelector } from "react-redux";
import { Table } from 'semantic-ui-react'
import "./styles/SongTable.css"

export default function SongTable() {
	const songsListSelector = useSelector((state: RootStateOrAny) => state.songsList.sList);

	const allSongs = Object.values(songsListSelector).flat();
	
	return <Table celled padded id="customTable" sortable>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell
          // sorted={sortedDir}
          // onClick={() => setSortedDir(swapDir(sortedDir))}
          >
          {<>Release Date<br/>(YYYY-MM-DD)</>}
        </Table.HeaderCell>
        <Table.HeaderCell>Song Name</Table.HeaderCell>
        <Table.HeaderCell>Artist(s)</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      {allSongs.map(((songEntry: SongObj) => {
        return <Table.Row key={songEntry.name + songEntry.popularity}>
        <Table.Cell>
            {songEntry.release_date}
        </Table.Cell>
        <Table.Cell singleLine>
          <a href={songEntry.ext_spotify_url} target="_blank" rel="noreferrer">{songEntry.name}</a>
        </Table.Cell>
        <Table.Cell>
          {songEntry.artists.map((artist : SpotifyArtistObj) => {
            return <a key={`artistLink for ${artist.name} for song ${songEntry.name}`}
                      href={artist.external_urls.spotify} target="_blank" rel="noreferrer">{artist.name}</a>;
          }).reduce((prev, curr) => [prev, ', ', curr])}
        </Table.Cell>
      </Table.Row>

      }))}
      
    </Table.Body>
  </Table>
}