import {
	useState,
	useEffect
} from "react";
import {
	spotifyApi
} from '../constants';

import {
	useDispatch,
} from 'react-redux'

import { addArtistSongs, addLoadingArtist } from "../features/songsList";

const errorStr = `Please try refreshing the page - your session may have timed out. If the problem persists, please contact the developer.`;

function areAlbumsSame(album1:AlbumObj, album2:SpotifyAlbumObj) {
	// technically could be done by iterating through whole list, but this is faster and works most cases
	return album1.name === album2.name && 
		album1.release_date === album2.release_date && album1.total_tracks === album2.total_tracks;
}

export default function useToFetchSongs(artistID: String) {	
	const [artistAlbumOffset, setArtistAlbumOffset] = useState(0);
	const [albumList, setAlbumList] = useState([]);
	const [doneLoadingAlbums, setDoneLoadingAlbums] = useState(false);

	const [albumTrackOffset, setAlbumTrackOffset] = useState(0);
    const [albumTrackList, setAlbumTrackList] = useState([]);
	const [doneLoadingTracks, setDoneLoadingTracks] = useState(false);

	const [trackOffset, setTrackOffset] = useState(0);
	const [trackListPop, setTrackListPop] = useState([]);
    const [doneLoadingTracksPop, setDoneLoadingTracksPop] = useState(false);

	const [finalTrackList, setFinalTrackList] = useState([]);
    const [doneLoadingFinalTrackList, setDoneLoadingFinalTrackList] = useState(false);

	const [curArtistID, setCurArtistID] = useState(undefined);
	const dispatch = useDispatch();

	function resetStates() {
		setArtistAlbumOffset(0);
		setAlbumList([]);
		setDoneLoadingAlbums(false);

		setAlbumTrackOffset(0);
		setAlbumTrackList([]);
		setDoneLoadingTracks(false);

		setTrackOffset(0);
		setTrackListPop([]);
		setDoneLoadingTracksPop(false);

		setFinalTrackList([]);
		setDoneLoadingFinalTrackList(false);
	}

	useEffect(() => {
		if(artistID == undefined) return;
		if(artistID.length == 0) return;

		if(artistID != curArtistID) {
			resetStates();
			setCurArtistID(artistID);
			return;
		}


		if (doneLoadingAlbums || artistAlbumOffset === -1) {
			setDoneLoadingAlbums(true);
			return;
		}

		dispatch(addLoadingArtist(artistID));

		spotifyApi.getArtistAlbums(curArtistID, {
			"offset": artistAlbumOffset
		}).then((res: SpotifyResponse) => {
			res.body.items.forEach((album : SpotifyAlbumObj) => {
				if (album.album_type === "compilation") return;

				setAlbumList(existingAlbums => [...existingAlbums, {
					id: album.id,
					name: album.name,
					total_tracks: album.total_tracks,
					release_date: album.release_date
				}])
			})

			if (res.body.items.length < 20) {
				setArtistAlbumOffset(-1);
				setDoneLoadingAlbums(true);
			} else {
				setArtistAlbumOffset(artistAlbumOffset => artistAlbumOffset + 20);
			}

		}).catch((err: ErrorMessage) => {
			console.log({
				err
			});
			alert(errorStr)
		});
	}, [artistID, curArtistID, artistAlbumOffset]);

	useEffect(() => {
		// https://stackoverflow.com/questions/2218999/how-to-remove-all-duplicates-from-an-array-of-objects
		setAlbumList(albumList.filter((value, index, self) =>
				index === self.findIndex((t) => (
					areAlbumsSame(t, value)
				))
		))
	}, [doneLoadingAlbums]);

	useEffect(() => {
        if(!doneLoadingAlbums) return; 

        let albumArr = albumList.slice(albumTrackOffset, albumTrackOffset + 20).map(album => album.id);

        if(albumList.length === 0 || albumTrackOffset === -1 || albumArr.length <= 0) {
            setDoneLoadingTracks(true);
            return;
        }
        
        spotifyApi.getAlbums(albumArr).then((res: SpotifyResponse) => {
            res.body.albums.forEach((album:SpotifyAlbumWithTracksObj) => {
                album.tracks.items.forEach(track => {
                    if(track.artists.filter((x: SpotifyTrackObj) => x.id === curArtistID).length > 0) {
                        setAlbumTrackList(existingTracks => [...existingTracks, track.id])
                    }
                })
            });

            if(albumArr.length < 20) {
                setAlbumTrackOffset(-1);
                setDoneLoadingTracks(true);
            } else {
                setAlbumTrackOffset(offset => offset + 20)
            }
        }).catch((err : ErrorMessage) => {
            alert(errorStr)
        })

        return () => {albumArr = []};
    }, [doneLoadingAlbums, albumTrackOffset])

	useEffect(() => {
        if(!doneLoadingTracks) return;

        let trackArr = albumTrackList.slice(trackOffset, trackOffset + 50);

        if(trackArr.length === 0 || trackOffset === -1 || albumTrackList.length === 0 || doneLoadingTracksPop) {
            setDoneLoadingTracksPop(true);
            return;
        }

        if(albumTrackList.length === 0) {
            return;
        }

        spotifyApi.getTracks(trackArr).then((res: SpotifyResponse) => {
            res.body.tracks.forEach((track: SpotifyTrackWithPopObj) => {
                setTrackListPop(oldTrack => {
                    if(track.external_urls.spotify) {
                        return [...oldTrack, 
                                {"name": track.name, 
                                "popularity": track.popularity, 
                                "artists": track.artists,
                                "ext_spotify_url": track.external_urls.spotify,
                                "available_markets" : track.available_markets,
                                "release_date" : track.album.release_date,
                                "uri" : track.uri}]
                    }
                })
            })

            if(trackArr.length < 50) {
                setTrackOffset(-1);
                setDoneLoadingTracksPop(true);
            } else {
                setTrackOffset(offset => offset + 50)
            }
        }).catch((err: ErrorMessage) => {
			console.log({err});
            alert(errorStr);
        })

        return () => {trackArr = []};
    }, [doneLoadingTracks, trackOffset, trackListPop]);

	useEffect(() => {
        if(!doneLoadingTracksPop) return;

        let tempArr = [];

        trackListPop.forEach((track) => {
            if(!tempArr.find(curTrack => curTrack.name.toLowerCase() === track.name.toLowerCase())) {
                let checkDupes = trackListPop.filter(oldTrack => 
                                                    oldTrack.name.toLowerCase() === track.name.toLowerCase());
                checkDupes.sort((a, b) => { 
					let sortMethod = "release_date"
					return Date.parse(a[sortMethod]) - Date.parse(b[sortMethod])
                });

				checkDupes[0].artists.sort((a, b) => {
					if(a.id === curArtistID) return -1;
					if(b.id === curArtistID) return 1;
					return 0;
				});

                tempArr.push(checkDupes[0])
            }
        })

		setFinalTrackList(tempArr);

		setDoneLoadingFinalTrackList(true);
        // tempArr.sort((a, b) => {
        //     if(sortMethod === "release_date") {
        //         return Date.parse(b[sortMethod])- Date.parse(a[sortMethod])
        //     } else {
        //         return b[sortMethod]- a[sortMethod]
        //     }
        // });
        return () => {tempArr = []}
    }, [doneLoadingTracksPop])

	useEffect(() => {
		if(!doneLoadingFinalTrackList) return;
		dispatch(addArtistSongs([curArtistID, finalTrackList]));	
	}, [doneLoadingFinalTrackList]);

	// return trackListPop;
}