# 🎵 Ranked Records 🎵
*Find all the Spotify songs by your favourite artists, ranked by popularity.*

Ranked Records is my first real full-stack application. The code here is a variation of (with secrets omitted) the version hosted with Heroku at [https://spotify-ranked-records.herokuapp.com/](https://spotify-ranked-records.herokuapp.com/)

The app is still in it's first version and has some code that isn't functional yet, but I'm getting there.

I referenced [this YouTube tutorial](https://www.youtube.com/watch?v=Xcet6msf3eE) to get started.

## FAQs

#### 🎶 What's the point of this site?

Spotify shows the top 10 most popular songs; this one shows all of them.

#### 🎶 Why is the top 10 list here different than the top 10 on Spotify?

This app sorts _every song_ from an artist, which Spotify doesn't always account for. The lists are generally pretty similar though.

#### 🎶 Why does the site sort by popularity and not another stat, like listens?

Spotify's API doesn't have listens 😢

#### 🎶 Why are there so many albums?

An "album" here also includes singles, features and any album they've appeared on.

#### 🎶 Why does it take so long for the songs to load?

This application making three types of requests:

1.  **GET all albums from an artist**

    All songs from an artist can't be retrieved directly, but albums can.

2.  **GET all tracks off the albums**

    This would be the last step... if popularity were stored in the tracks retrieved from the album. Unfortunately, those can only be accessed by directly getting the track. Instead, the application stores all the IDs of all the album songs for the next step.

3.  **GET all tracks by ID**

    Using the track IDs from the previous step, the application gets all the tracks (with popularity) which are then sorted, filtered and displayed.

You also might notice that there is some grouping while loading (first step goes up in 20s, third step goes up in 50s, etc.) This is to reduce the number of Spotify API calls.

#### 🎶 Why does the number of songs loaded differ from the amount displayed in the final table?

I do some filtering to make sure there aren't any repeats (taking the track with the higher popularity score).

#### 🎶 Why is X so laggy?

I'm working on it :)
