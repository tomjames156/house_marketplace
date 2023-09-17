import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getAuth } from 'firebase/auth'
import { getDoc, doc } from 'firebase/firestore'
import Spinner from '../components/Spinner'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import shareIcon from '../assets/svg/shareIcon.svg'


function Listing() {
    const [listing, setListing] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [shareLinkCopied, setShareLinkCopied] = useState(false)
    const {listingId} = useParams()
    const mover = useNavigate()
    const auth = getAuth()

    const getListing = async(listing_id) => {
        setIsLoading(true)
        let docRef = doc(db, 'listings', listing_id)
        let docSnap = await getDoc(docRef)

        if(docSnap.exists()){
           setListing(docSnap.data())
        }else{
            toast.error('Listing not found')
        }
        setIsLoading(false)
    }

    useEffect(() => {
        getListing(listingId)
    }, [])

    if(isLoading){
        return <Spinner/>
    }

  return (
    <main>
        {/* SLIDER */}
        <div className="shareIconDiv" onClick={() => {
            navigator.clipboard.writeText(window.location.href)
            setShareLinkCopied(true)
            setTimeout(()=> setShareLinkCopied(false), 2000)
        }}>
            <img src={shareIcon} alt="" />
        </div>
        {shareLinkCopied && <p className='linkCopied'>Link Copied!</p>}
        <div className="listingDetails">
            <p className="listingName">{listing.name} - ${listing.offer ? parseInt(listing?.discountedPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : parseInt(listing?.regularPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }</p>
            <p className="listingLocation">{listing.location}</p>
            <p className="listingType">For {listing.type === 'rent' ? 'Rent' : 'Sale'}</p>
            {listing.offer && (
            <p className='discountPrice'>
                ${parseInt(listing.regularPrice) - parseInt(listing.discountedPrice)} discount</p>
            )} 
            <ul className="listingDetailsList">
                <li>
                    {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms`: "1 Bedroom"}
                </li>
                <li>
                    {listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms`: '1 Bathroom'}
                </li>
                <li>{listing.parking && "Parking Spot"}</li>
                <li>{listing.furnished && "Furnished"}</li>
            </ul>
            {/* MAP */}
            <p className="listingLocationTitle">Location</p>
            {auth.currentUser.uid !== listing.userRef &&
                <Link className='primaryButton' to={`/contact/${listing.userRef}?listingName=${listing.name}?listingLocation=${listing.location}`}>Contact Landlord</Link>}
        </div>
    </main>
  )
}
{/* .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} */}

export default Listing