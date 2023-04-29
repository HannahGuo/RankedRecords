import SpotifyWebApi from "spotify-web-api-node"

export const clientID = "261761120bec41c0a86bdfeb8f0c43f9"

export const spotifyApi = new SpotifyWebApi({
  clientId: clientID
});

export const CURRENT_URL = process.env.REACT_APP_CURRENT_URL || "http://localhost:3000/";
export const CURRENT_SERVER_URL = process.env.REACT_APP_CURRENT_URL || "http://localhost:3001/";

export const errorStr = `Please try refreshing the page - your session may have timed out. If the problem persists, please contact the developer.`;