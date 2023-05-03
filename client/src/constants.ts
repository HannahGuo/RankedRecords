import SpotifyWebApi from "spotify-web-api-node"

export const clientID = "261761120bec41c0a86bdfeb8f0c43f9"

export const spotifyApi = new SpotifyWebApi({
  clientId: clientID
});

export const CURRENT_URL = process.env.REACT_APP_CURRENT_URL || "http://localhost:3000/";
export const CURRENT_SERVER_URL = process.env.REACT_APP_CURRENT_URL || "http://localhost:3001/";

export const errorStr = `Please try refreshing the page - your session may have timed out. If the problem persists, please contact the developer.`;

export const defaultFilterOptions = [
  {label: 'remix', value: 'remix'},
  {label: 'commentary', value: 'commentary'},
  {label: 'karaoke', value: 'karaoke'},
  {label: 'instrumental', value: 'instrumental'},
  {label: 'acoustic', value: 'acoustic'},
  {label: 'voice memo', value: 'voice memo'},
];

export const pluralize = (num: number, word: string) => {
  return num === 1 ? word : word + 's';
}