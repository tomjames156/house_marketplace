import { useNavigate, useLocation } from "react-router-dom"
import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg'
import { ReactComponent as OfferIcon } from '../assets/svg/localOfferIcon.svg'
import { ReactComponent as PersonOutlineIcon } from '../assets/svg/personOutlineIcon.svg'

function Navbar() {
  const mover = useNavigate()
  const location = useLocation()

  const pathMatch = (route) => {
    if(route === location.pathname){
        return true
    }
  }

  return (
    <footer className="navbar">
        <nav className="navbarNav">
            <ul className="navbarListItems">
                <li className="navbarListItem" onClick={() => {mover('/')}} >
                    <ExploreIcon fill={pathMatch('/') ?'#2c2c2c' : '#8f8f8f'} width='36px' height='36px' />
                    <p className={pathMatch('/') ? 'navbarListItemNameActive': 'navbarListItemName'}>Explore</p>
                </li>
                <li className="navbarListItem" onClick={() => {mover('/offers')}}>
                    <OfferIcon fill={pathMatch('/offers') ?'#2c2c2c' : '#8f8f8f'} width='36px' height='36px' />
                    <p className={pathMatch('/offers') ? 'navbarListItemNameActive': 'navbarListItemName'}>Offers</p>
                </li>
                <li className="navbarListItem" onClick={() => {mover('/profile')}}>
                    <PersonOutlineIcon fill={pathMatch('/profile') ?'#2c2c2c' : '#8f8f8f'} width='36px' height='36px' />
                    <p className={pathMatch('/profile') ? 'navbarListItemNameActive': 'navbarListItemName'}>Profile</p>
                </li>
            </ul>
        </nav>

    </footer>
  )
}

export default Navbar