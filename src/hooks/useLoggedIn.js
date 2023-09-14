import { useState, useEffect } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"

export const useLoggedIn = () => {
    const [loggedIn, setLoggedIn] = useState(false)
    const [checkingStatus, setCheckIngStatus] = useState(true)

    useEffect(() => {
        const auth = getAuth()
        onAuthStateChanged(auth, (user) => {
            if(user){
                setLoggedIn(true)
            }
            setCheckIngStatus(false)
        })
    }, [])

  return {loggedIn, checkingStatus}
}