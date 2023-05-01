type ArtistObj = {
	key: string,
	id: string,
	name: string,
	image: {src: string}
	url: string,

	// for the semantic ui dropdown
	value: string,
	text: string,
}

type AlbumObj = {
	id: string,
	name: string,
	total_tracks: number,
	release_date: string
}

type ArtistDBObj = {
	id: string,
	name: string,
	image: string,
	songs: any,
	url: string,
}

type SongObj = {
	artists: any,
	available_markets: Array<string>,
	duration_ms: number,
	ext_spotify_url: string,
	name: string,
	popularity: number,
	release_date: string,
}

type ErrorMessage = {
	body: any,
	headers: any,
	statusCode: number,
	message: string
}

type SpotifyResponse = {
	body: any,
	headers: any,
	statusCode: number
}

// Was kind of too lazy to properly define these, though these definitions should suffice
type SpotifyImageObj = {
	height: number,
	width: number,
	url: string
}
type SpotifyArtistObj = {
	external_urls: any,
	followers: any,
	genres: Array<string>,
	href: string,
	id: string,
	images: Array<SpotifyImageObj>,
	name: string,
	popularity: number,
	type: string,
	uri: string
}

type SpotifyAlbumObj = {
	album_group: string,
	album_type: string,
	artists: Array<SpotifyArtistObj>,
	available_markets: Array<string>,
	external_urls: any,
	href: string,
	id: string,
	images: Array<SpotifyImageObj>,
	name: string,
	release_date: string,
	release_date_precision: string,
	total_tracks: number,
	type: string,
	uri: string
}

type SpotifyCopyrightObj = {
	text: string,
	type: string
}

type SpotifyTrackObj = {
	artists: any,
	available_markets: Array<string>,
	disc_number: number,
	duration_ms: number,
	explicit: boolean,
	external_urls: any,
	href: string,
	id: string,
	is_local: boolean,
	name: string,
	preview_url: string,
	track_number: number,
	type: string,
	uri: string
}

type SpotifyTrackWithPopObj = {
	album: SpotifyAlbumObj
	artists: any,
	available_markets: Array<string>,
	disc_number: number,
	duration_ms: number,
	explicit: boolean,
	external_ids: any,
	external_urls: any,
	href: string,
	id: string,
	is_local: boolean,
	name: string,
	popularity: number,
	preview_url: string,
	track_number: number,
	type: string,
	uri: string
}

type SpotifyTracksObj = {
	href: string,
	items: Array<SpotifyTrackObj>,
	limit: number,
	next: any,
	offset: number,
	previous: any,
	total: number 
}

type SpotifyAlbumWithTracksObj = {
	album_type: string,
	artists: Array<SpotifyArtistObj>,
	available_markets: Array<string>,
	copyrights: Array<SpotifyCopyrightObj>,
	external_ids: any,
	external_urls: any,
	genres: any,
	href: string,
	id: string,
	images: Array<SpotifyImageObj>,
	label: string,
	name: string,
	popularity: number,
	release_date: string,
	release_date_precision: string,
	total_tracks: number,
	tracks: SpotifyTracksObj,
	type: string,
	uri: string
}

type SpotifyPlaylistObj = {
	external_urls: any,
}