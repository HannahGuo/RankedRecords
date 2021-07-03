import React from "react"

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
    "redirect_uri": "https://spotify-ranked-records.herokuapp.com/",
    "scope": `streaming%20user-read-email%20user-read-private%20user-library-read%20
              user-library-modify%20user-read-playback-state%20user-modify-playback-state`
}

const auth_url = createAuthURL(auth_settings);

export default function Login() {
    return(
    <div>
        <a href={auth_url}>Login with Spotify</a>
    </div>
    );
}