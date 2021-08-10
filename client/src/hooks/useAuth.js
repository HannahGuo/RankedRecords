import { useState, useEffect } from "react"
import axios from "axios"
import { CURRENT_SERVER_URL } from "../constants";

export default function useAuth(code, isLog){
    const [accessToken, setAccessToken] = useState("");
    // const [expiresIn, setExpiresIn] = useState(0);

    useEffect(() => {
        if(!isLog) {
            axios.post(CURRENT_SERVER_URL).then(res => {
                setAccessToken(res.data.accessToken);
                // setExpiresIn(res.data.expiresIn);    
            }).catch((err) => { 
                console.log("home err reg", err)
                alert("An error occurred, please try refreshing the page or contacting the developer")
            })
        } else if(code){
            axios.post(CURRENT_SERVER_URL + "login/", {code}).then(res => {
                setAccessToken(res.data.accessToken);
                // setExpiresIn(res.data.expiresIn);    
            }).catch((err) => { 
                console.log("home err log", err,);
                alert("An error occurred, please try refreshing the page or contacting the developer")
            })
        }
    }, [code, isLog])
    
    return accessToken;
}