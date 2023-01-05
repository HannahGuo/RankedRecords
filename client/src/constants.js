import SpotifyWebApi from "spotify-web-api-node"

export const spotifyApi = new SpotifyWebApi({
  clientId: "261761120bec41c0a86bdfeb8f0c43f9"
});

export const CURRENT_URL = process.env.REACT_APP_CURRENT_URL || "http://localhost:3000/";
export const CURRENT_SERVER_URL = process.env.REACT_APP_CURRENT_URL || "http://localhost:3001/";