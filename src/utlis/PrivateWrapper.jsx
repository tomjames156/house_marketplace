import { useLoggedIn } from '../hooks/useLoggedIn'
import Spinner from '../components/Spinner'
import { Outlet, Navigate } from 'react-router-dom'

function PrivateWrapper() {
  const {loggedIn, checkingStatus} = useLoggedIn()
  
  if(checkingStatus){
    return <Spinner/>
  }

  return (
   loggedIn ? <Outlet/> : <Navigate to='/sign-in'/>
  )
}

export default PrivateWrapper