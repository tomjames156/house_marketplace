import { toast } from 'react-toastify'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const auth = getAuth()

  const onChange = e => setEmail(e.target.value)

  const onSubmit = async e => {
    e.preventDefault()
    try{
      await sendPasswordResetEmail(auth, email)
      toast.success("Password reset link has been sent to your email")
    }catch(err){
      toast.error('Password Reset Failed')
    }
  }

  return (
    <div className='pageContainer'>
      <header>
        <p className='pageHeader'>ForgotPassword</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <input 
            type="email" 
            name="email" 
            id="email"
            placeholder='Email'
            className='emailInput'
            value={email || ''}
            onChange={onChange}
          />
          <Link className='forgotPasswordLink' to='/sign-in'>Sign In</Link>
          <div className='signInBar'>
            <div className="signInText">Send Reset Link</div>
            <button className='signInButton' type='submit'>
              <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
            </button>
          </div>
        </form>
      </main>
    </div> 
  )
}

export default ForgotPassword