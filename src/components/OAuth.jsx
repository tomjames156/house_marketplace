import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import googleIcon from '../assets/svg/googleIcon.svg'
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { toast } from "react-toastify"
import { db } from '../firebase.config'

function OAuth() {
  const navigator = useNavigate()
  const {pathname} = useLocation()

  const onGoogleClick = async () => {
    try{
      const auth = getAuth()
      const provider = new GoogleAuthProvider()

      const result = await signInWithPopup(auth, provider)
      const user = result.user

      const usersDocRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(usersDocRef)

      if(!docSnap.exists()){
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          fullname: user.displayName,
          timestamp: serverTimestamp()
        })
      }

      console.log(pathname)
      navigator('/')
      toast.success("Welcome to House Marketplace")
    }catch(err){
      toast.error("Could not authorize with Google")
    }
  }

  return (
    <div className="socialLogin">
      <p>Sign {pathname === '/sign-in' ? 'in' : 'up'} with</p>
      <button className="socialIconDiv" onClick={onGoogleClick}>
        <img className="socialIconImg" src={googleIcon} alt="google"/>
      </button>
    </div>
  )
}

export default OAuth