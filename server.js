const express = require("express")
const cors = require("cors")
const path = require('path')
const secret = require('./secret').clientSecret
const SpotifyWebApi = require("spotify-web-api-node")

const app = express()
app.use(cors())
app.use(express.urlencoded({extended: true}));
app.use(express.json()) // To parse the incoming requests with JSON payloads
app.use(express.static(path.join(__dirname, 'client/build')));

app.post("/", (req, res) => {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        clientId: '261761120bec41c0a86bdfeb8f0c43f9',
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

app.post("/refresh", (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        clientId: '261761120bec41c0a86bdfeb8f0c43f9',
        clientSecret: secret,
        refreshToken,
    });

    spotifyApi
            .refreshAccessToken()
            .then(data => {
                res.json({
                    accessToken: data.body.accessToken,
                    expiresIn: data.body.expiresIn,
                })
            })
        .catch(err => {
            console.log(err)
            res.sendStatus(400)
    })
})  

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 3001;
app.listen(port);