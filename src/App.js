import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Explore from './pages/Explore'
import ForgotPassword from './pages/ForgotPassword'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Offers from './pages/Offers'
import Category from './pages/Category'
import PrivateWrapper from './utlis/PrivateWrapper'
import Navbar from './components/Navbar'
import { ToastContainer } from 'react-toastify'
import CreateListing from './pages/CreateListing'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Explore/>}></Route>
          <Route path="/profile" element={<PrivateWrapper/>}>
            <Route path='' element={<Profile/>}/>
          </Route>
          <Route path="/sign-in" element={<SignIn/>}></Route>
          <Route path="/sign-up" element={<SignUp/>}></Route>
          <Route path="/offers" element={<Offers/>}></Route>
          <Route path="/category/:categoryName" element={<Category/>} />
          <Route path="/forgot-password" element={<ForgotPassword/>}></Route>
          <Route path="/listing/create" element={<CreateListing/>} />
        </Routes>
        <Navbar/>
      </Router>
      <ToastContainer position='top-center' autoClose={3000} />
    </>
  );
}

export default App;
