import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Creatable from "react-select/creatable"
import { Button, Dropdown, Image, Modal } from "semantic-ui-react"
import {
	defaultFilterOptions,
	errorStr,
	pluralize,
	spotifyApi,
} from "./constants"
import {
	SortDirection,
	SortMethod,
	changeSortDirection,
	changeSortMethod,
	setFilters,
} from "./features/listSettings"
import useToFetchSongs from "./hooks/useToFetchSongs"
import useToSortSongs from "./hooks/useToSortSongs"
import SearchBar from "./SearchBar"
import "./styles/ControlBox.css"

//https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
function toTitleCase(str: String) {
	return str.toLowerCase().replace(/\b\w/g, (s: String) => s.toUpperCase())
}

export default function ControlBox() {
	const [optionsModalOpen, setOptionsModalOpen] = useState(false)
	const [playlistModalOpen, setPlaylistModalOpen] = useState(false)
	const [newPlaylist, setNewPlaylist] = useState<SpotifyPlaylistObj>(null)
	const [playlistCreatedModalOpen, setPlaylistCreatedModalOpen] =
		useState(false)

	const listSettings = useSelector((state: any) => state.listSettings)
	const userSettings = useSelector(
		(state: any) => state.spotifyUserSettings.user,
	)
	const artistList = useSelector((state: any) => state.artistList.aList)
	const songsList = useToSortSongs()

	const sortMethodDropdown = [
		{
			key: SortMethod.POPULARITY,
			text: "Popularity",
			value: SortMethod.POPULARITY,
		},
		{
			key: SortMethod.CHRONOLOGY,
			text: "Chronology",
			value: SortMethod.CHRONOLOGY,
		},
	]

	const sortDirectionDropdown = [
		{
			key: SortDirection.ASCENDING,
			text: "Ascending",
			value: SortDirection.ASCENDING,
		},
		{
			key: SortDirection.DESCENDING,
			text: "Descending",
			value: SortDirection.DESCENDING,
		},
	]

	const dispatch = useDispatch()

	function handleSortMethodChange(
		e: React.ChangeEvent<HTMLInputElement>,
		data: any,
	) {
		dispatch(changeSortMethod(data.value))
	}

	function handleSortDirectionChange(
		e: React.ChangeEvent<HTMLInputElement>,
		data: any,
	) {
		dispatch(changeSortDirection(data.value))
	}

	function handleFilterChange(values: any) {
		dispatch(setFilters(values.map((filter) => filter.value)))
	}

	function getTextByKey(key: SortMethod) {
		const found = sortMethodDropdown.find((item) => item.key === key)
		return found ? found.text : undefined
	}

	let userDisplay = undefined
	if (
		userSettings != null &&
		userSettings.images[0] &&
		userSettings.images[0].hasOwnProperty("url")
	) {
		userDisplay = (
			<>
				<Image src={userSettings.images[0].url} avatar />
				Logged in as: {userSettings.display_name}
			</>
		)
	}

	let artistString =
		artistList.length > 0
			? artistList
					.flat()
					.map((artist: any) => artist.name)
					.join(", ")
			: "None Selected"
	let numSongs = songsList.length
	let filters =
		listSettings.filterOptions.length !== 0
			? listSettings.filterOptions.join(", ")
			: "None selected"
	let sortMethod =
		listSettings.sortDirection +
		" " +
		getTextByKey(listSettings.sortMethod).toLowerCase()

	function createPlaylist() {
		let today = new Date().toISOString().slice(0, 10)

		let playlistTitle = `${userSettings.display_name}'s Ranked Records Playlist`

		let playlistDesc = `${pluralize(
			artistList.length,
			"Artist",
		)}: ${artistString} | Sorted Order: ${sortMethod}`

		if (listSettings.filterOptions.length > 0) {
			playlistDesc = `${pluralize(
				artistList.length,
				"Artist",
			)}: ${artistString} | ${pluralize(
				listSettings.filterOptions.length,
				"Filter",
			)}: ${filters} | Sorted in ${sortMethod} order.`
		}

		spotifyApi
			.createPlaylist(`${playlistTitle}`, {
				description: `${playlistDesc} Made with Ranked Records on ${today}`,
				public: true,
			})
			.then(async (data) => {
				let playlistID = data.body.id

				let songURIs = songsList.map((val: SpotifyTrackObj) => val.uri)

				for (let i = 0; i < songURIs.length; i += 100) {
					await spotifyApi
						.addTracksToPlaylist(
							playlistID,
							songURIs.slice(i, i + 100),
						)
						.then((data) => {
							// console.log(`Success! - Set ${(i + 1)} Tracks Loaded `);
						})
				}

				setNewPlaylist(data.body)
			})
			.catch((err: SpotifyResponse) => {
				console.log({ err })
				alert(errorStr + " Playlist Creation")
			})
	}

	useToFetchSongs()

	return (
		<div id="controlBoxDiv">
			<div id="searchAndButtonsDiv">
				<SearchBar />
				<div id="controlButtonsDiv">
					<>
						<Modal
							closeIcon
							id="optionsModal"
							open={optionsModalOpen}
							onClose={() => setOptionsModalOpen(false)}
							onOpen={() => setOptionsModalOpen(true)}
							trigger={
								<div
									className="buttonDark"
									onClick={() => setOptionsModalOpen(true)}
								>
									Options
								</div>
							}
						>
							<Modal.Header>⚙️ Playlist Options </Modal.Header>
							<Modal.Content>
								<Modal.Description>
									<div id="optionsModalDiv">
										<div>
											<strong>Sort Method:</strong>
											<br />
											<Dropdown
												closeOnChange
												selection
												value={listSettings.sortMethod}
												onChange={
													handleSortMethodChange
												}
												options={sortMethodDropdown}
											/>
										</div>
										<div>
											<strong>Sort Direction:</strong>
											<br />
											<Dropdown
												closeOnChange
												selection
												value={
													listSettings.sortDirection
												}
												onChange={
													handleSortDirectionChange
												}
												options={sortDirectionDropdown}
											/>
										</div>
									</div>
									<h5>Filters</h5>
									<p>
										Filter out songs with the following
										words or phrase (not case-sensitive):
									</p>
									<Creatable
										id="filterSelect"
										placeholder="Select filters (type to add custom)"
										isMulti
										onChange={handleFilterChange}
										options={defaultFilterOptions}
										value={listSettings.filterOptions.map(
											(filter: string) => {
												return {
													value: filter,
													label: filter,
												}
											},
										)}
									/>
								</Modal.Description>
							</Modal.Content>
							<Modal.Actions>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										justifyContent: "space-between",
										alignItems: "center",
										color: "gray",
										textAlign: "center",
										width: "100%",
									}}
								>
									<Button
										id="purpleBackground"
										onClick={() =>
											setOptionsModalOpen(false)
										}
									>
										Return to Song List
									</Button>
									<br />
									<em>
										Options are automatically saved and will
										reflect in the right-side song list.
									</em>
								</div>
							</Modal.Actions>
						</Modal>
					</>
					<>
						<Modal
							closeIcon
							id="playlistModal"
							open={playlistModalOpen}
							onClose={() => setPlaylistModalOpen(false)}
							onOpen={() => setPlaylistModalOpen(true)}
							trigger={
								<div
									className="buttonDark"
									onClick={() => setPlaylistModalOpen}
								>
									Create Playlist
								</div>
							}
						>
							<Modal.Header>💿 Playlist Creation </Modal.Header>
							<Modal.Content>
								<div>
									{userDisplay}
									<br />
									<div id="summaryHead">
										Here is a summary of your playlist. If
										you'd like to make changes, close this
										window and continue editing your
										settings.
									</div>
									<strong>
										{pluralize(artistList.length, "Artist")}
										:{" "}
									</strong>{" "}
									{artistString}
									<br />
									<strong>
										Total Number of Songs:{" "}
									</strong>{" "}
									{numSongs}
									<br />
									<strong>Ordering: </strong>{" "}
									{toTitleCase(sortMethod)}
									<br />
									<strong>Filters: </strong> {filters}
									<br />
									<div id="playlistModalWarning">
										{artistList.length === 0 ||
										songsList.length === 0
											? "You have no songs selected! Close this window and add some songs to your playlist."
											: undefined}
									</div>
								</div>
							</Modal.Content>
							<Modal.Actions>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										width: "fit-content",
									}}
								>
									{artistList.length === 0 ||
									songsList.length === 0 ? undefined : (
										<Button
											id="purpleBackground"
											style={{ marginBottom: "10px" }}
											onClick={() => {
												createPlaylist()
												setPlaylistModalOpen(false)
												setPlaylistCreatedModalOpen(
													true,
												)
											}}
										>
											Create Playlist and Add to Spotify
											Account
										</Button>
									)}
									<Button
										onClick={() =>
											setPlaylistModalOpen(false)
										}
									>
										Return to Song List
									</Button>
								</div>
							</Modal.Actions>
						</Modal>
					</>

					<>
						<Modal
							id="playlistCreatedModal"
							closeIcon
							open={playlistCreatedModalOpen}
							onClose={() => setPlaylistCreatedModalOpen(false)}
							onOpen={() => setPlaylistCreatedModalOpen(true)}
						>
							<Modal.Content>
								{newPlaylist && newPlaylist.external_urls && (
									<>
										<p>
											Your new playlist has been created -
											click the link below, or check your
											Spotify account!
										</p>
										<p>
											Close this window to create a new
											playlist!
										</p>
										<a
											href={
												newPlaylist.external_urls
													.spotify
											}
											target="_blank"
											rel="noreferrer"
										>
											{newPlaylist.external_urls.spotify}
										</a>
									</>
								)}
							</Modal.Content>
						</Modal>
					</>
				</div>
			</div>
		</div>
	)
}
