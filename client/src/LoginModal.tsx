import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button, Icon, Modal } from "semantic-ui-react"
import { CURRENT_URL, clientID, errorStr, spotifyApi } from "./constants"
import { setStartAuth, setUser } from "./features/spotifyUserSettings"
import useAuth from "./hooks/useAuth"
import "./styles/LoginModal.css"

import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function createAuthURL(settings) {
	let authStr = "https://accounts.spotify.com/authorize?"

	for (let key in settings) {
		if (settings.hasOwnProperty(key)) {
			authStr = authStr.concat(`${key}=${settings[key]}&`)
		}
	}
	return authStr.slice(0, -1)
}

const auth_settings = {
	client_id: clientID,
	response_type: "code",
	redirect_uri: CURRENT_URL + "login",
	scope: `user-read-email%20playlist-modify-public`,
}

const toastContent = (message: String) =>
	toast(message, {
		position: "top-right",
		autoClose: 3000,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: false,
		draggable: false,
		progress: undefined,
	})

export default function LoginModal() {
	const dispatch = useDispatch()
	const accessTokenLog = useSelector(
		(state: any) => state.spotifyUserSettings.accessToken,
	)
	const startAuth = useSelector(
		(state: any) => state.spotifyUserSettings.startAuth,
	)

	const auth_url = createAuthURL(auth_settings)
	const [firstLoginModalOpen, setFirstLoginModalOpen] = useState(true)

	useAuth(startAuth)

	function handleClick() {
		window.location.href = auth_url
		dispatch(setStartAuth(true))
	}

	useEffect(() => {
		if (accessTokenLog) {
			spotifyApi
				.getMe()
				.then((res: SpotifyResponse) => {
					dispatch(setUser(res.body))
					setFirstLoginModalOpen(false)
					toastContent(`✅ Logged in as ${res.body.display_name}`)
				})
				.catch((err: SpotifyResponse) => {
					console.log(
						"Something went wrong!",
						err,
						"Code URL: ",
						err.body,
						accessTokenLog,
					)
					alert(errorStr + " Login Issue")
				})
		}
	}, [accessTokenLog, dispatch])

	return (
		<>
			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss={false}
				draggable={false}
				pauseOnHover={false}
			/>

			<Modal
				id={"firstLoginModal"}
				open={firstLoginModalOpen && !accessTokenLog}
			>
				<Modal.Content>
					<h1>Welcome to Ranked Records! 💿</h1>
					<p>
						This site lets you make playlists with{" "}
						<strong>all</strong> the songs by your favorite artists.
						Combine multiple artists, sort by popularity or
						chronology, and add filters to make the perfect
						playlist!
						<br />
						<br />
						<a
							href="https://www.producthunt.com/products/ranked-records"
							target="_blank"
							rel="noreferrer"
						>
							More details can be found on the Product Hunt page
						</a>
						. Connect with Spotify below to get started!
					</p>
				</Modal.Content>
				<Modal.Actions>
					<div id="loginButtonsDiv">
						<Button onClick={handleClick} id="loginButton">
							<Icon name="spotify" />
							Connect with Spotify
						</Button>
					</div>
				</Modal.Actions>
			</Modal>
		</>
	)
}
