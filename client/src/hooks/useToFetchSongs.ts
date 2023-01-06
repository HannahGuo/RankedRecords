import {
	useState,
	useEffect
} from "react";
import {
	spotifyApi
} from '../constants';

import {
	useSelector,
	RootStateOrAny
} from 'react-redux'

const errorStr = `Please try refreshing the page - your session may have timed out. If the problem persists, please contact the developer.`;

function areSongsSame(album1:AlbumObj, album2:SpotifyAlbumObj) {
	// technically could be done by iterating through whole list, but this is faster and works most cases
	return album1.name === album2.name && album1.release_date === album2.release_date && album1.total_tracks === album2.total_tracks;
}

export default function useToFetchSongs() {
	const artistListSelector = useSelector((state: RootStateOrAny) => state.artistList.aList);
	const songsListSelector = useSelector((state: RootStateOrAny) => state.songsList.sList);

	const [artistID, setArtistID] = useState("");
	const [artistAlbumOffset, setArtistAlbumOffset] = useState(0);
	const [doneLoadingAlbums, setDoneLoadingAlbums] = useState(false);
	const [albumList, setAlbumList] = useState([]);

	const [albumTrackOffset, setAlbumTrackOffset] = useState(0);
	const [doneLoadingTracks, setDoneLoadingTracks] = useState(false);
    const [trackList, setTrackList] = useState([]);

	const [trackListPop, setTrackListPop] = useState([]);
    const [trackOffset, setTrackOffset] = useState(0);
    const [doneLoadingTracksPop, setDoneLoadingTracksPop] = useState(false);

	useEffect(() => {
		artistListSelector.forEach((artist : ArtistObj) => {
			let songListArtistIDs = songsListSelector.map(x => x[0].artistID);
			if(!songListArtistIDs.includes(artist[0].value)){
				setArtistID(artist[0].value);
				return;
			}
		})
	}, [
		artistListSelector
	])

	useEffect(() => {
		if(artistID.length == 0) return;
		if (doneLoadingAlbums || artistAlbumOffset === -1) {
			setDoneLoadingAlbums(true);
			return;
		}

		spotifyApi.getArtistAlbums(artistID, {
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
	}, [artistID, artistAlbumOffset]);

	useEffect(() => {
		// https://stackoverflow.com/questions/2218999/how-to-remove-all-duplicates-from-an-array-of-objects
		setAlbumList(albumList.filter((value, index, self) =>
				index === self.findIndex((t) => (
					areSongsSame(t, value)
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
                    if(track.artists.filter((x: SpotifyTrackObj) => x.id === artistID).length > 0) {
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
        }).catch((err : ErrorMessage) => {
            alert(errorStr)
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
    }, [doneLoadingTracks, trackOffset, doneLoadingTracksPop, trackList]);

	return trackListPop;
}