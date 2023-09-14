import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {ReactComponent as RightArrow} from '../assets/svg/keyboardArrowRightIcon.svg'
import OAuth from '../components/OAuth'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const [forms, setForms] = useState({
    email: '',
    password: '' 
  })
  const {email, password} = forms
  const mover = useNavigate()

  const handleChange = (e) => {
    let name = e.target.name
    let value = e.target.value
    setForms(values => ({...values, [name]: value}))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      const auth = getAuth()
      const userCredentials = await signInWithEmailAndPassword(auth, forms.email, forms.password)
      
      let {user} = userCredentials
      if(user){
        mover('/')
        toast.success(`Welcome back`)
      }
    }catch(error){
      toast.error('Invalid Credentials Provided')
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
            type="email" 
            className='emailInput'
            placeholder='Email'
            id='email'
            name='email'
            value={email || ''}
            onChange={handleChange}
          />
          <div className="passwordInputDiv">
            <input 
              type={showPassword ? 'text' : 'password'}
              className='passwordInput'
              placeholder='Password'
              id='password'
              name='password'
              value={password}
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

          <div className="signInBar">
            <p className="signInText">
              Sign In
            </p>
            <button className='signInButton'>
              <RightArrow fill="#ffffff" width="34px" height="34px" />
            </button>
          </div>

        </form>
        <OAuth/>
        <Link to='/sign-up' className='registerLink'>
          Sign Up Instead
        </Link>
      </div>
    </>
  )
}

export default SignIn