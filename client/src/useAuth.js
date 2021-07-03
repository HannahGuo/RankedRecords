import { useState, useEffect } from "react"
import axios from "axios"

export default function useAuth(code){
    const [accessToken, setAccessToken] = useState("");
    const [expiresIn, setExpiresIn] = useState(0);
    const currentURL = "http://localhost:3001/";
    // const currentURL = "https://spotify-ranked-records.herokuapp.com/";

    useEffect(() => {
        axios.post(currentURL).then(res => {
            console.log("og", res.data);
            setAccessToken(res.data.accessToken);
            setExpiresIn(res.data.expiresIn);
        }).catch((err) => { 
            console.log("home err", err)
        })
    }, [code])

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