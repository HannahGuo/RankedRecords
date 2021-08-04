import { useState, useEffect } from "react"
import axios from "axios"
import { CURRENT_SERVER_URL } from "./constants";

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
            })
        } else if(code){
            axios.post(CURRENT_SERVER_URL + "login/", {code}).then(res => {
                setAccessToken(res.data.accessToken);
                // setExpiresIn(res.data.expiresIn);    
            }).catch((err) => { 
                console.log("home err log", err,)
            })
        }
    }, [code, isLog])

    // useEffect(() => {
    //     if (!expiresIn) return
    //     const interval = setInterval(() => {
    //       axios
    //         .post(currentURL + "refresh")
    //         .then(res => {
    //           setAccessToken(res.data.accessToken)
    //           setExpiresIn(res.data.expiresIn)
    //         })
    //         .catch(() => {
    //           window.location = "/"
    //         })
    //     }, (expiresIn - 60) * 1000)
    
    //     return () => clearInterval(interval)
    //   }, [expiresIn])
    
    return accessToken;
}