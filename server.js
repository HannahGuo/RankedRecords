const express = require("express")
const cors = require("cors")
const path = require('path')

require('dotenv').config()

const secret = process.env.SECRET || require('./secret').clientSecret
const redirectUri = process.env.LOGIN_URL || "http://localhost:3000/login"
const clientId = "261761120bec41c0a86bdfeb8f0c43f9"
const SpotifyWebApi = require("spotify-web-api-node")

const app = express()
app.use(cors())
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json()) // To parse the incoming requests with JSON payloads
app.use(express.static(path.join(__dirname, 'client/build')));

app.post("/", (req, res) => {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        clientId: clientId,
        clientSecret: secret,
    });

    spotifyApi
        .clientCredentialsGrant(code)
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                expiresIn: data.body.expires_in,
            })
        }).catch(() => {
            res.sendStatus(400)
        })
});

app.post("/login", (req, res) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
        clientId: clientId,
        clientSecret: secret,
        redirectUri: redirectUri
    })

    spotifyApi.authorizationCodeGrant(code)
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in,
            })
        })
        .catch(err => {
            console.log({err})
            res.sendStatus(400)
        })
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 3001;
app.listen(port);