# 🎵 Ranked Records 🎵
*Find all the Spotify songs by your favourite artists, ranked by popularity.*

Ranked Records is my first real full-stack application. The code here is a variation of (with secrets omitted) the version hosted with Heroku at [https://ranked-records.herokuapp.com/](https://ranked-records.herokuapp.com/). 

Since Heroku takes a while to load on free tier, I created a [landing page](https://hannahguo.me/RankedRecords/) explaining this (also found on the landing-page branch of this repository).

The app is still in it's first version and has some code that isn't functional yet, but I'm getting there.

I referenced [this YouTube tutorial](https://www.youtube.com/watch?v=Xcet6msf3eE) to get started.

## Contributing
Contributing for this project is currently **closed**. However, I do plan on adding it in the future, so you can star this repository to get notified when that happens!

## FAQs

#### 🎶 What's the point of this site?
<a href="https://community.spotify.com/t5/Live-Ideas/Desktop-Full-Discography-Reinstatement/idi-p/5178453" rel="noreferrer" target="_blank">Spotify does not have a method of retrieving all of an artist's songs</a>. This site does that, while adding some snazzy filters and sort options.

#### 🎶 Do you collect my data?

Nope. Regardless if you authenticate with Spotify or not, I don't store anything on my end. The project is also completely open source so you can see what's running the app. 

Any playlists that are generated are by default public on your Spotify profile - but if you'd like, you can change it to private (and alter the title/description).

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
