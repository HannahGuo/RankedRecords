import React, {useState} from "react"
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

export default function Login({setUserLogin}) {
    const [betaAccess, setBetaAccess] = useState(false);
    const auth_url = createAuthURL(auth_settings);

    function handleClick(){
        let betaPrompt = prompt("If you do not have beta access, please close the pop-ups to proceed to the site.")

        // if you're looking at the source code for the prompt, sorry to disappoint but
        // entering it will still break the site as your email is not authenticated in the Spotify dashboard :)
        // this isn't meant to be super secure secret - just a way to avoid problems for the average user

        setBetaAccess(betaPrompt === "RR");

        if(betaPrompt === "RR") {
            window.location.href = auth_url;
        }

        setUserLogin(betaPrompt === "RR");
    }

    function handleBetaAccessClick() {
        window.open('https://forms.gle/mrxbKuwLkqWujC5t9', '_blank');
    }

    return (
        <div id="loginButtonsDiv">
        <Button onClick={handleClick} id="loginButton" disabled={betaAccess}>
            Connect with Spotify (beta, requires access code)
            <br/> 
            Close this window to search! :)
        </Button>
        <Button onClick={handleBetaAccessClick} id="betaAccessButton" color="violet">
            Request Beta Access (Playlist Creation)
        </Button>
        </div>
    );
}