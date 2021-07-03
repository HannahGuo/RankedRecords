import React, {useState, useEffect} from "react"
import useAuth from "./useAuth"
import SpotifyWebApi from "spotify-web-api-node"
import { Dropdown, Button, Popup, Modal, Icon } from 'semantic-ui-react'
import CustomTable from "./CustomTable";
import "./Dashboard.css"

const spotifyApi = new SpotifyWebApi({
    clientId: "261761120bec41c0a86bdfeb8f0c43f9"
})

export default function Dashboard({code}) {
    const accessToken = useAuth(code)
        
    const [searchValue, setSearchValue] = useState("")
    const [searchResults, setSearchResults] = useState([])
    
    const [artistResults, setArtistResults] = useState([]);
    const [artistID, setArtistID] = useState("");

    const [artistAlbumOffset, setArtistAlbumOffset] = useState(0);
    const [albumTrackOffset, setAlbumTrackOffset] = useState(0);
    const [trackOffset, setTrackOffset] = useState(0);

    const [albumList, setAlbumList] = useState([]);
    const [trackList, setTrackList] = useState([]);
    const [trackListPop, setTrackListPop] = useState([]);
    const [finalTrackList, setFinalTrackList] = useState([]);

    const [doneLoadingAlbums, setDoneLoadingAlbums] = useState(false);
    const [doneLoadingTracks, setDoneLoadingTracks] = useState(false);
    const [doneLoadingTracksPop, setDoneLoadingTracksPop] = useState(false);
    const [doneLoadingFinalTrackList, setDoneLoadingFinalTrackList] = useState(false);

    const [disableEntering, setDisableEntering] = useState(false);
    const [faqOpen, setFaqOpen] = React.useState(false)

    function resetFields() {
        setSearchResults([]);

        setArtistAlbumOffset(0);
        setAlbumTrackOffset(0);
        setTrackOffset(0);

        setAlbumList([]);
        setTrackList([]);
        setTrackListPop([]);
        setFinalTrackList([]);

        setDoneLoadingAlbums(false);
        setDoneLoadingTracks(false);
        setDoneLoadingTracksPop(false);
        setDoneLoadingFinalTrackList(false);
    }

    function handleChange(e, data) {
        let temp = data.options.filter(x => x.value === data.value);
        resetFields();
        setArtistID(temp[0].value);
        setDisableEntering(true);
    }

    function handleSearchChange(e, data) {
        setSearchValue(e.target.value);
    }

    function handleClose() {
        setSearchResults([]);
        setArtistResults([]);
    }

    function customSearch(options, query) {
        if(query === "") return [];
        return options;
    }   

    useEffect(() => {
        if(!accessToken) return;
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    useEffect(() => {
        if(!searchValue || searchValue === "") return;
        if(!accessToken) return;

        spotifyApi.searchArtists(searchValue).then(res => {
            setSearchResults(res)
            
            if(res === [] || !searchResults.body) return;

            let filteringArtists = [];
            
            searchResults.body.artists.items.forEach((item) => {
                let currentArtist = (({name, id}) => ({name, id}))(item);

                const { name: key, name: text, id: value, ...rest } = currentArtist;
                const new_obj = { key, text, value, ...rest }

                new_obj.image = {};
                new_obj.image.src = item.images[0] === undefined ? "" : item.images[0].url;

                new_obj.key = new_obj.key + item.id;

                filteringArtists.push(new_obj);
            });
            setArtistResults(filteringArtists);

        }).catch((err) => {
            console.log({err})
        })

    }, [searchValue, accessToken, searchResults]);

    useEffect(() => {
        if(!artistID) return;

        if(doneLoadingAlbums || artistAlbumOffset === -1) {
            setDoneLoadingAlbums(true);
            return;
        }

        spotifyApi.getArtistAlbums(artistID, {"offset": artistAlbumOffset}).then(res => {
            res.body.items.forEach((album) => {
                if(album.album_type === "compilation") return;
                setAlbumList(existingAlbums => [...existingAlbums, {id: album.id, name: album.name, total_tracks: album.total_tracks}])
            })
            
            if(res.body.items.length < 20) {
                setArtistAlbumOffset(-1);
                setDoneLoadingAlbums(true);
            } else {
                setArtistAlbumOffset(artistAlbumOffset => artistAlbumOffset + 20);
            }
        }).catch((err) => {
            console.log({err});
        })
    }, [artistID, artistAlbumOffset, doneLoadingAlbums])

    useEffect(() => {
        if(!doneLoadingAlbums) return; 

        let albumArr = albumList.slice(albumTrackOffset, albumTrackOffset + 20).map(album => album.id);

        if(albumList.length === 0 || albumTrackOffset === -1 || albumArr.length <= 0) {
            setDoneLoadingTracks(true);
            return;
        }
        
        spotifyApi.getAlbums(albumArr).then(res => {
            res.body.albums.forEach(album => {
                album.tracks.items.forEach(track => {
                    if(track.artists.filter(x => x.id === artistID).length > 0) {
                        setTrackList(existingTracks => [...existingTracks, track.id])
                    }
                })
            });

            if(albumArr.length < 20) {
                setAlbumTrackOffset(-1);
                setDoneLoadingTracks(true);
            } else {
                setAlbumTrackOffset(offset => offset + 20)
            }
        }).catch((err) => {
            console.log({err});
        })

        return () => {albumArr = []};
    }, [doneLoadingAlbums, albumTrackOffset, albumList, artistID])

    useEffect(() => {
        if(!doneLoadingTracks) return;

        let trackArr = trackList.slice(trackOffset, trackOffset + 50);

        if(trackArr.length === 0 || trackOffset === -1 || trackList.length === 0 || doneLoadingTracksPop) {
            setDoneLoadingTracksPop(true);
            return;
        }

        if(trackList.length === 0) {
            return;
        }

        spotifyApi.getTracks(trackArr).then(res => {
            res.body.tracks.forEach((track) => {
                setTrackListPop(oldTrack => [...oldTrack, 
                                            {"name": track.name, 
                                            "popularity": track.popularity, 
                                            "artists": track.artists,
                                            "ext_spotify_url": track.external_urls.spotify}])
            })

            if(trackArr.length < 50) {
                setTrackOffset(-1);
                setDoneLoadingTracksPop(true);
            } else {
                setTrackOffset(offset => offset + 50)
            }
        }).catch((err) => {
            console.log({err});
        })

        return () => {trackArr = []};
    }, [doneLoadingTracks, trackOffset, doneLoadingTracksPop, trackList]);

    useEffect(() => {
        if(!doneLoadingTracksPop) return;

        let tempArr = [];

        trackListPop.forEach((track) => {
            if(!tempArr.find(curTrack => curTrack.name.toLowerCase() === track.name.toLowerCase())) {
                let checkDupes = trackListPop.filter(oldTrack => 
                                                    oldTrack.name.toLowerCase() === track.name.toLowerCase());
                checkDupes.sort((a, b) => b.popularity - a.popularity);        
                tempArr.push(checkDupes[0])
            }
        })

        tempArr.sort((a, b) => b.popularity - a.popularity);
        setFinalTrackList(tempArr);
        setDoneLoadingFinalTrackList(true);

        return () => {tempArr = []}
    }, [doneLoadingTracksPop, trackListPop])

    useEffect(() => {
        if(doneLoadingFinalTrackList) setDisableEntering(false);
    }, [doneLoadingFinalTrackList])

    return(
    <div>
        <div id="header">
            <h1>Ranked Records</h1>
            <div id="header-desc">Find all the Spotify songs by your favourite artists, ranked by popularity
                <Popup trigger={<Button circular basic inverted id="popButton" icon='question circle'/>}>
                    <Popup.Content>
                    <b>From the Spotify Web API: </b>
                    <p>The popularity of a track is a value between 0 and 100, with 100 being the most popular.</p>
                    <p>It is calculated by algorithm and is based, in the most part, on the total number of plays the track has had and how recent those plays are.</p>
                    <p><em>To learn more, check out the <b>FAQ</b> section below.</em></p>
                    </Popup.Content>
                </Popup>
            </div>
            <div id="action-bar">
            {disableEntering && 
                <div id="disableDiv">
                    <em>
                        Please wait until the current artist songs have loaded before entering another one.
                    </em>
                </div>
            }
            <Dropdown fluid selection deburr closeOnChange search={customSearch}
                options={artistResults} placeholder={"Search for an artist..."}
                onChange={(e, data) => handleChange(e, data)}
                onSearchChange={(e, data) => handleSearchChange(e, data)}
                onClose={(e, data) => handleClose(e, data)}
                id={"dropdown"}
                disabled={disableEntering}
                selectOnNavigation={false}
                />
            </div>
        </div>

        {artistID && !doneLoadingFinalTrackList && 
            <div className={"centeredMessageDiv"}>
                <h3>Current Loading Stage:</h3>
                {!doneLoadingAlbums ? <p>Loading Albums... Currently found {albumList.length}</p> : <p>(1/3) {albumList.length} Albums Loaded!</p>}
                {doneLoadingAlbums && 
                    (!doneLoadingTracks ? <p>Loading Tracks... Currently found {trackList.length}</p> : <p>(2/3) {trackList.length} Tracks Loaded!</p>)}
                {doneLoadingTracks && 
                    (!doneLoadingTracksPop ? <p>Loading Tracks with Popularity... Currently loaded {trackListPop.length} </p> : <p>(3/3) Tracks with Popularity Loaded!</p>)}
            </div>
        }

        {doneLoadingFinalTrackList && <div className={"centeredMessageDiv"}>{finalTrackList.length} tracks loaded.</div>}

        <CustomTable loading={artistID && !doneLoadingFinalTrackList} data={finalTrackList} artistID={artistID}></CustomTable>

        <div id="footer">
            <div>Made with ❤ by <a href="https://hannahguo.me/" target="_blank" rel="noreferrer">Hannah Guo️</a></div>

            <div id="footer-links">
                <Modal closeIcon 
                    open={faqOpen}
                    onClose={() => setFaqOpen(false)}
                    onOpen={() => setFaqOpen(true)}
                    trigger={<Button basic inverted color="grey"><Icon name="question"/>FAQs</Button>}>

                    <Modal.Header>💿 Ranked Records FAQs</Modal.Header>
                    <Modal.Content scrolling>
                        <Modal.Description>
                            <h4>🎶 What's the point of this site?</h4>
                            <p>Spotify shows the top 10 most popular songs; this one shows all of them.</p>

                            <h4>🎶 Why is the top 10 list here different than the top 10 on Spotify?</h4>
                            <p>This app sorts <em>every song</em> from an artist, which Spotify doesn't always account for. The lists are generally pretty similar though.</p>

                            <h4>🎶 Why does the site sort by popularity and not another stat, like listens?</h4>
                            <p>Spotify's API doesn't have listens 😢</p>

                            <h4>🎶 Why are there so many albums?</h4>
                            <p>An "album" here also includes singles, features and any album they've appeared on.</p>

                            <h4>🎶 Why does it take so long for the songs to load?</h4>
                            <p>This application making three types of requests:</p>
                            <ol>
                                <li>
                                    <strong>GET all albums from an artist</strong>
                                    <p>All songs from an artist can't be retrieved directly, but albums can.</p>
                                </li>

                                <li>
                                    <strong>GET all tracks off the albums</strong>
                                    <p>This would be the last step... if popularity were stored in the tracks retrieved from the album. 
                                        Unfortunately, those can only be accessed by directly getting the track. 
                                        Instead, the application stores all the IDs of all the album songs for the next step.</p>
                                </li>

                                <li>
                                    <strong>GET all tracks by ID</strong>
                                    <p>Using the track IDs from the previous step, the application gets all the tracks (with popularity) which are then sorted, filtered and displayed.</p>
                                </li>
                            </ol>
                            <br/>
                            <p>You also might notice that there is some grouping while loading (first step goes up  in 20s, third step goes up in 50s, etc.)
                                This is to reduce the number of Spotify API calls.</p>

                            <h4>🎶 Why does the number of songs loaded differ from the amount displayed in the final table?</h4>
                            <p>I do some filtering to make sure there aren't any repeats (taking the track with the higher popularity score).</p>

                            <h4>🎶 Why is X so laggy?</h4>
                            <p>I'm working on it :)</p>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                    </Modal.Actions>
                </Modal>
                <a href="#" target="_blank" rel="noreferrer">
                    <Button basic inverted color="grey"><Icon name="github"/>Github</Button>
                </a>
                <a href="https://developer.spotify.com/" target="_blank" rel="noreferrer">
                    <Button basic inverted color="grey"><Icon name="spotify"/>Spotify Developer Docs</Button>
                </a>
            </div>
        </div>
    </div>
    );
}