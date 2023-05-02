import {
	useState,
	useEffect
} from "react";
import {
	errorStr,
	spotifyApi
} from '../constants';

import {
	useDispatch, useSelector, RootStateOrAny
} from 'react-redux'

import { LoadingStages, addArtistSongs, addLoadingArtist, resetLoadingTotals, setLoadingStatus, updateLoadingStatus } from "../features/songsList";
import { updateArtistID } from "../features/artistList";

function areAlbumsSame(album1:AlbumObj, album2:SpotifyAlbumObj) {
	// technically could be done by iterating through whole list, but this is faster and works most cases
	return album1.name === album2.name && 
		album1.release_date === album2.release_date && album1.total_tracks === album2.total_tracks;
}

export default function useToFetchSongs() {	
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

	// const artistListSelector = useSelector((state: RootStateOrAny)  => state.artistList.aList);
	const curArtistID = useSelector((state: RootStateOrAny)  => state.artistList.curArtistID);

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

		dispatch(resetLoadingTotals());
	}

	useEffect(() => {
		if(curArtistID === undefined || curArtistID.length === 0) {
			return;
		}
		
		if (doneLoadingAlbums || artistAlbumOffset === -1) {
			setDoneLoadingAlbums(true);
			return;
		}

		dispatch(setLoadingStatus(true));
		dispatch(addLoadingArtist(curArtistID.toString()));

		dispatch(updateLoadingStatus([LoadingStages.ALBUMS, artistAlbumOffset]));

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
			console.log({err});
			alert(errorStr)
		});
	}, [curArtistID, artistAlbumOffset]);

	useEffect(() => {
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
        
		dispatch(updateLoadingStatus([LoadingStages.TRACKS, albumTrackOffset]));
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

		dispatch(updateLoadingStatus([LoadingStages.TRACKS_POP, trackOffset]));
        spotifyApi.getTracks(trackArr).then((res: SpotifyResponse) => {
            res.body.tracks.forEach((track: SpotifyTrackWithPopObj) => {
                setTrackListPop(oldTrack => {
                    if(track.external_urls.spotify) {
						// todo: could use external id's here
                        return [...oldTrack, 
                                {"name": track.name, 
                                "popularity": track.popularity, 
                                "artists": track.artists,
                                "ext_spotify_url": track.external_urls.spotify,
								"duration_ms": track.duration_ms,
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

        trackListPop.forEach((track: SpotifyTrackWithPopObj) => {

            if(!tempArr.find((curTrack: SpotifyTrackWithPopObj) => 
					curTrack.name.toLowerCase() === track.name.toLowerCase()
					&& curTrack.duration_ms === track.duration_ms)) {
                // all tracks with this type
				let checkDupes = trackListPop.filter(oldTrack => 
                                                    oldTrack.name.toLowerCase() === track.name.toLowerCase() &&
													oldTrack.duration_ms === track.duration_ms);

				// we filter out based on popularity, and then set the release date to the earliest one
                let earliestRelease = checkDupes.sort((a, b) => { 
					let sortMethod = "release_date"
					return Date.parse(a[sortMethod]) - Date.parse(b[sortMethod])
                });

				// find the one with the highest popularity:
				let mostPopular = checkDupes.sort((a, b) => b.popularity - a.popularity)[0];

				let clonedObject = {...mostPopular}
				clonedObject = {...clonedObject, "release_date": earliestRelease[0]["release_date"]}

				// sort the artists so that the current artist is first
				clonedObject.artists.sort((a, b) => {
					if(a.id === curArtistID) return -1;
					if(b.id === curArtistID) return 1;
					return 0;
				});

                tempArr.push(clonedObject)
            }
        })

		setFinalTrackList(tempArr);

		setDoneLoadingFinalTrackList(true);
        return () => {tempArr = []}
    }, [doneLoadingTracksPop])

	useEffect(() => {
		if(!doneLoadingFinalTrackList) return;
		dispatch(setLoadingStatus(false));
		dispatch(addArtistSongs([curArtistID, finalTrackList]));	
		dispatch(updateArtistID(undefined));
		resetStates();
	}, [doneLoadingFinalTrackList, finalTrackList, curArtistID]);
}