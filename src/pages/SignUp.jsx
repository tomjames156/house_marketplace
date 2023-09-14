import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import {db} from '../firebase.config'
import {ReactComponent as RightArrow} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { toast } from 'react-toastify'
import OAuth from '../components/OAuth'

function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [forms, setForms] = useState({
    fullname: '',
    email: '',
    password: '' 
  })
  const mover = useNavigate()

  const handleChange = (e) => {
    let name = e.target.name
    let value = e.target.value
    setForms(values => ({...values, [name]: value}))
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    const auth = getAuth()
    try{
      const userCredentials = await createUserWithEmailAndPassword(auth, forms.email, forms.password)
      const {user} = userCredentials
      
      await updateProfile(auth.currentUser, {
        displayName: forms.fullname
      })


      const formDataCopy = {...forms}
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp()


      await setDoc(doc(db, 'users', user.uid), formDataCopy)
      
      mover('/')
      toast.info('Welcome to House Marketplace')
    }catch(error){
      toast.error('Sign up Failed🥲')
    }
  }

  return (
    <>
      <div className='pageContainer'>
        <header>
          <p className="pageHeader">Welcome Back</p>
        </header>

        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            className='nameInput'
            placeholder='Fullname'
            id='name'
            name='fullname'
            value={forms.fullname || ''}
            onChange={handleChange}
          />
          <input 
            type="email" 
            className='emailInput'
            placeholder='Email'
            id='email'
            name='email'
            value={forms.email || ''}
            onChange={handleChange}
          />
          <div className="passwordInputDiv">
            <input 
              type={showPassword ? 'text' : 'password'}
              className='passwordInput'
              placeholder='Password'
              id='password'
              name='password'
              value={forms.password}
              onChange={handleChange}
            />

            <img 
              src={visibilityIcon} 
              alt='show password' 
              className='showPassword'
              onClick={() => setShowPassword((prevState) => !prevState)}
            />
          </div>

          <Link to="/forgot-password" className='forgotPasswordLink'>
            Forgot Password
          </Link>

          <div className="signUpBar">
            <p className="signUpText">
              Sign Up
            </p>
            <button type='submit' className='signUpButton'>
              <RightArrow fill="#ffffff" width="34px" height="34px" />
            </button>
          </div>
        </form>

        <OAuth/>
        <Link to='/sign-in' className='registerLink'>
          Sign In Instead
        </Link>
      </div>
    </>
  )
}

export default SignUp