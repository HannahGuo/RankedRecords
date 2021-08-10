import React from "react"
import { Button } from 'semantic-ui-react'
import {CURRENT_URL} from "./constants";
import "./Dashboard.css"

function createAuthURL(settings){
    let authStr = "https://accounts.spotify.com/authorize?";

    for (let key in settings) {
        if (settings.hasOwnProperty(key)) {
            authStr = authStr.concat(`${key}=${settings[key]}&`)
        }
    }
    return authStr.slice(0, -1);
}

const auth_settings = {
    "client_id": "261761120bec41c0a86bdfeb8f0c43f9",
    "response_type": "code",
    "redirect_uri": CURRENT_URL + "login",
    "scope": `streaming%20user-read-email%20user-library-modify%20playlist-modify-public%20`
}

const auth_url = createAuthURL(auth_settings);

export default function Login({setUserLogin}) {
    function handleClick(){
        setUserLogin(true);
    }

    return (
        <a href={auth_url}>
            <Button onClick={handleClick} id="loginButton" disabled={true}>
                Connect with Spotify
                <br/> 
                Due to this app still being in development mode (essentially a beta), user authentication is not currently active. Searching is though, so close this window and get to it! :)
            </Button>
        </a>
    );
}