import React from "react"
import { Button, Popup } from 'semantic-ui-react'

export function PopularityTip() {
    return <Popup trigger={<Button circular basic inverted id="popButton" icon='question circle' aria-label="about-popularity"/>}>
            <Popup.Content>
            <b>From the Spotify Web API: </b>
            <p>The popularity of a track is a value between 0 and 100, with 100 being the most popular.</p>
            <p>It is calculated by algorithm and is based, in the most part, on the total number of plays the track has had and how recent those plays are.</p>
            <p><em>To learn more, check out the <b>FAQ</b> section below.</em></p>
        </Popup.Content>
    </Popup>
}