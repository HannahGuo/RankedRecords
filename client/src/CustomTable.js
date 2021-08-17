import React from 'react'
import { Table, Popup, Button } from 'semantic-ui-react'
import "./CustomTable.css"

function swapDir(dir) {
  if(dir === "ascending") {
    return "descending";
  } else {
    return "ascending";
  }
}

const CustomTable = ({data, artistID, loading, sortMethod, sortedDir, setSortedDir}) => {
  if(loading || !artistID || (!data[0] || !data[0].artists)) {
    return <div className="defaultTableDiv">Results will appear here!</div>;
  }
  
  if(data.length === 0 && !loading) {
    return <div className="defaultTableDiv">No results found.</div>
  }
    
  return <Table celled padded id="customTable" sortable>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell
          sorted={sortedDir}
          onClick={() => setSortedDir(swapDir(sortedDir))}
          >
          {sortMethod === "popularity" ? 
          <>Popularity 
          <Popup trigger={<Button circular basic inverted id="popButton" icon='question circle' aria-label="about-popularity"/>}>
              <Popup.Content>
              <b>From the Spotify Web API: </b>
              <p>The popularity of a track is a value between 0 and 100, with 100 being the most popular.</p>
              <p>It is calculated by algorithm and is based, in the most part, on the total number of plays the track has had and how recent those plays are.</p>
              <p><em>To learn more, check out the <b>FAQ</b> section below.</em></p>
              </Popup.Content>
          </Popup>
          </> : <>Release Date<br/>(YYYY-MM-DD)</>}
        </Table.HeaderCell>
        <Table.HeaderCell>Song Name</Table.HeaderCell>
        <Table.HeaderCell>Artist(s)</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      {data.map(((songEntry) => {
        let organizedArtists = [...songEntry.artists];
        organizedArtists.splice(organizedArtists.findIndex(artist => artist.id === artistID), 1);
        organizedArtists.unshift(songEntry.artists.find((artist) => artist.id === artistID));

        return <Table.Row key={songEntry.name + artistID}>
        <Table.Cell>
            {songEntry[sortMethod]}
        </Table.Cell>
        <Table.Cell singleLine>
          <a href={songEntry.ext_spotify_url} target="_blank" rel="noreferrer">{songEntry.name}</a>
        </Table.Cell>
        <Table.Cell>
          {organizedArtists.map((artist) => {
            return <a key={`artistLink for ${artist.name} for song ${songEntry.name}`}
                      href={artist.external_urls.spotify} target="_blank" rel="noreferrer">{artist.name}</a>;
          }).reduce((prev, curr) => [prev, ', ', curr])}
        </Table.Cell>
      </Table.Row>

      }))}
      
    </Table.Body>
  </Table>
}

export default CustomTable
