import { useState, useEffect } from "react"
import axios from "axios"
import { CURRENT_SERVER_URL } from "../constants";

export default function useAuth(isLoggedIn){
    const [accessToken, setAccessToken] = useState("");

    useEffect(() => {
		axios.post(CURRENT_SERVER_URL).then(res => {
			setAccessToken(res.data.accessToken);
		}).catch((err) => { 
			console.log("home err reg", err)
			alert("An error occurred, please try refreshing the page or contacting the developer")
		})
    }, [isLoggedIn])
    
    return accessToken;
}