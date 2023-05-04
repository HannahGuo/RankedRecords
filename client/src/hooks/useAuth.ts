import {
	useEffect
} from "react"
import axios from "axios"
import {
	CURRENT_SERVER_URL, spotifyApi
} from "../constants";
import { setAccessToken } from "../features/spotifyUserSettings";
import {useDispatch, useSelector} from "react-redux";

export default function useAuth(startAuth: Boolean) {
	let code =  new URLSearchParams(window.location.search).get("code");
	const accessToken = useSelector((state: any) => state.spotifyUserSettings.accessToken);
	const dispatch = useDispatch();

	let postCount = 0;

	useEffect(() => {
		if(!startAuth && !code) return;
		if(!code) return;

		if(postCount == 0) { // yeah I don't really know why this tries to post multiple times but here we are.
			postCount++;
			axios.post(CURRENT_SERVER_URL + "login/", {code}).then(res => {
				dispatch(setAccessToken(res.data.accessToken));
				// setExpiresIn(res.data.expiresIn);    
			}).then((res) => {
				window.history.pushState({}, null, "/")
			}).catch((err) => { 
				console.log("home err log", err,);
				alert("An error occurred. If you were not prompted for a login, please enable pop-ups and try again. Otherwise, try refreshing the page or contacting the developer if the problem persists.")
			})
		}
	}, [startAuth])

	useEffect(() => {
		if(!accessToken) return;
		spotifyApi.setAccessToken(accessToken);
	}, [accessToken])

	return accessToken;
}