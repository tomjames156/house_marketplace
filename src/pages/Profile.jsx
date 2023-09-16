import { useState } from 'react'
import { getAuth, updateEmail, updateProfile } from 'firebase/auth'
import { toast } from 'react-toastify'
import { updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg' 

function Profile() {
  const auth = getAuth()
  const user = auth.currentUser
  const mover = useNavigate()

  const [changeDetails, setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name: user.displayName,
    email: user.email
  })

  const {name, email} = formData

  const onLogout = () => {
    auth.signOut()
    mover('/')
  }

  const onSubmit = async() => {
    try{
      if(user.displayName !== name){
        await updateProfile(user, {
          displayName: name
        })

        let userRef = doc(db, 'users', user.uid)
        await updateDoc(userRef, {
          fullname: name
        })
      }

      if(user.email !== email){
        await updateEmail(user, email)
        toast.success("Email Successfully updated")

        let userRef = doc(db, 'users', user.uid)
        await updateDoc(userRef, {
          email: email
        })
      }
    }catch(err){
      console.log(err)
      toast.error("Could not update profile")
    }
  }

  const onChange = (e)=> {
    setFormData((prevState) => ({...prevState, [e.target.id]: e.target.value}))
  }


  return (
    <div className='profile'>
      <header className='profileHeader'>
        <p className="pageHeader">My Profile</p>
        <button className="logOut" onClick={onLogout}>Logout</button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p className="changePersonalDetails" onClick={() => {
            changeDetails && onSubmit()
            setChangeDetails((prevState) => !prevState)}
          }>
            {changeDetails ? 'done' : 'change'}
          </p>
        </div> 
        <div>
          <form>
            <input
              type="text"
              id='name'
              className={!changeDetails ? 'profileName': 'profileNameActive'} 
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              type="text"
              id='email'
              className={!changeDetails ? 'profileEmail': 'profileEmailActive'}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>
        <Link to="/listing/create" className="createListing">
          <img src={homeIcon} alt="home" />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt="arrow right icon" />
        </Link>
      </main>
    </div>
  )
}

export default Profile