export function FAQModalContent() {
    return <>
        <h4>🎶 What's the point of this site?</h4>
        <p><a href="https://community.spotify.com/t5/Live-Ideas/Desktop-Full-Discography-Reinstatement/idi-p/5178453" rel="noreferrer" target="_blank" class="blackLink">Spotify does not have an easy method of retrieving all of an artist's songs</a> 
        &nbsp; This site does that, while adding playlist creation with some snazzy filters and sort options.</p>

        <h4>🎶 Do you collect my data?</h4>
        <p>
            Nope. Regardless if you authenticate with Spotify or not, I don't store anything on my end. The project is also completely open source so you can see what's running the app. 
        <br/><br/>
            Any playlists that are generated are by default public on your Spotify profile - but if you'd like, you can change it to private (and alter the title/description).
        </p>

        <h4>🎶 Why is the top 10 list here different than the top 10 on Spotify?</h4>
        <p>This app sorts <em>every song</em> from an artist, which Spotify doesn't always account for. The lists are generally pretty similar though.</p>

        <h4>🎶 Why does the site sort by popularity and not another stat, like listens?</h4>
        <p>Spotify's API doesn't have listens 😢</p>

        <h4>🎶 Why are there so many albums?</h4>
        <p>An "album" here also includes singles, features and any album they've appeared on.</p>

        <h4>🎶 Why does it take so long for the songs to load?</h4>
        <p>This application making three types of requests:</p>
        <ol>
            <li>
                <strong>GET all albums from an artist</strong>
                <p>All songs from an artist can't be retrieved directly, but albums can.</p>
            </li>

            <li>
                <strong>GET all tracks off the albums</strong>
                <p>This would be the last step... if popularity were stored in the tracks retrieved from the album. 
                    Unfortunately, those can only be accessed by directly getting the track. 
                    Instead, the application stores all the IDs of all the album songs for the next step.</p>
            </li>

            <li>
                <strong>GET all tracks by ID</strong>
                <p>Using the track IDs from the previous step, the application gets all the tracks (with popularity and release date) which are then sorted, filtered and displayed.</p>
            </li>
        </ol>
        <br/>
        <p>You also might notice that there is some grouping while loading (first step goes up  in 20s, third step goes up in 50s, etc.)
            This is to reduce the number of Spotify API calls - it's still a sizeable amount though.</p>

        <h4>🎶 Why does the number of songs loaded differ from the amount displayed in the final table?</h4>
        <p>I do some filtering to make sure there aren't any repeats (taking the track with the higher popularity score or first occurance chronologically).</p>

        <h4>🎶 My question isn't here!</h4>
        <p>Contact me <a class="blackLink" href="https://forms.gle/nigc6Bwdq5hZETRY9" target="_blank" rel="noreferrer">here</a> and I'll try my best to answer!</p>
    </>;
}