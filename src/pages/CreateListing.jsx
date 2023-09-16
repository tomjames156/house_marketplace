import { useState, useRef, useEffect } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { toast } from 'react-toastify'
import { db } from '../firebase.config'
import { useNavigate } from 'react-router-dom'
import { serverTimestamp, addDoc, doc, collection } from 'firebase/firestore'
import Spinner from '../components/Spinner'

function CreateListing() {
    const [geolocationEnabled, setGeolocation] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        type: 'rent',
        name: '',
        bathrooms: 1,
        bedrooms: 1,
        furnished: false,
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        location: '',
        lat: 0,
        lng: 0,
        images: [],
        parking: false
    })
    const MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

    let {type, name, location, parking, furnished, bathrooms, bedrooms, offer, regularPrice, discountedPrice, lat, lng, images} = formData

    const auth = getAuth()
    const isMounted = useRef(true)
    const mover = useNavigate()

    const onMutate = (e) => {
        let boolean = null
        if(e.target.value === 'false'){
            boolean = false
        }

        if(e.target.value === 'true'){
            boolean = true
        }

        if(e.target.files){
            setFormData((prevState) => ({
                ...prevState, 
                images: e.target.files}
            ))
        }

        if(!e.target.files){
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value
            }))
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        
        setIsLoading(true)

        if(discountedPrice >= regularPrice){
            console.log('grah')
            toast.error('Discounted price needs to be less than regular price')
            return 
        }

        if(images.length > 6){
            setIsLoading(false)
            toast.error('Max 6 images')
            return
        }

        let geolocation = {}
        let listingLocation

        if (geolocationEnabled){
            let response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${MAPS_API_KEY}`)
            let data = await response.json()
            let {results} = data
            
            geolocation.lat = results[0]?.geometry.location.lat ?? 0
            geolocation.lng = results[0]?.geometry.location.lat ?? 0

            listingLocation = data.status === 'ZER0_RESULTS' ? undefined : results[0]?.formatted_address

            if(listingLocation === undefined || listingLocation.includes('undefined')){
                setIsLoading(false)
                toast.error('Please enter a valid address')
                return
            }
        }else{
            geolocation.lat = lat
            geolocation.lng = lng
        }

        formData.geolocation = geolocation
        formData.location = listingLocation
        delete formData.lat
        delete formData.lng
        setIsLoading(false)
    }


    
    useEffect(() => {
        if(isMounted){
            onAuthStateChanged(auth, (user) => {
                if(user){
                    setFormData({...formData, userRef: user.uid})
                }else{
                    navigator('/sign-in')
                }
            })
        }

        return () => {
            isMounted.current = false
        }
    }, [isMounted])

    if(isLoading){
        return <Spinner/>
    }

  return (
    <div  className='profile'>
        <header>
            <p className="pageHeader">Create a Listing</p>
        </header>

        <main>
            <form onSubmit={onSubmit}>
                <label className="formLabel">Sell / Rent</label>
                <div className="formButtons">
                    <button
                        type='button'
                        className={type === 'sale' ? 'formButtonActive' : 'formButton'}
                        id='type'
                        value='sale'
                        onClick={onMutate}
                    >Sell</button>
                    <button
                        type='button'
                        className={type === 'rent' ? 'formButtonActive' : 'formButton'}
                        id='type'
                        value='rent'
                        onClick={onMutate}
                    >Rent</button>
                </div>
                <div className="formLabel">Name</div>
                <input className='formInputName' id='name' value={name} onChange={onMutate} maxLength={32} minLength={10} required type="text" />
                <div className="formRoom flex">
                    <div>
                        <label className="formLabel">Bedrooms</label>
                        <input type="number" id="bedrooms" value={bedrooms} onChange={onMutate} className='formInputSmall' min='1' max='50' required />
                    </div>
                    <div>
                        <label className="formLabel">Bathrooms</label>
                        <input type="number" id="bathrooms" value={bathrooms} onChange={onMutate} className='formInputSmall' min='1' max='50' required />
                    </div>
                </div>
                <label className="formLabel">Parking Spot</label>
                <div className="formButtons">
                    <button
                        className={parking ? 'formButtonActive': 'formButton'}
                        type='button' id='parking' value={true} onClick={onMutate}
                    >
                        Yes
                    </button>
                    <button
                        className={!parking && parking !== null ? 'formButtonActive': 'formButton'}
                        type='button' id='parking' value={false} onClick={onMutate}
                    >No</button>
                </div>
                <label className="formLabel">Furnished</label>
                <div className="formButtons">
                    <button
                        className={furnished ? 'formButtonActive': 'formButton'}
                        type='button' id='furnished' value={true} onClick={onMutate}
                    >
                        Yes
                    </button>
                    <button
                        className={!furnished && furnished !== null ? 'formButtonActive': 'formButton'}
                        type='button' id='furnished' value={false} onClick={onMutate}
                    >No</button>
                </div>
                <label className="formLabel">Address</label>
                <textarea className='formInputAddress' value={location} onChange={onMutate} id="location" required></textarea>
                {!geolocationEnabled && geolocationEnabled !== null && 
                (<div className='formLatLng flex'>
                    <div>
                        <label className="formLabel">Latitude</label>
                        <input type="number" className='formInputSmall' id='lat' value={lat} onChange={onMutate} required />
                    </div>
                    <div>
                        <label className="formLabel">Longitude</label>
                        <input type="number" className='formInputSmall' id='lng' value={lng} onChange={onMutate} required />
                    </div>
                </div>)}
                <label className="formLabel">Offer</label>
                <div className="formButtons">
                    <button
                        className={offer ? 'formButtonActive': 'formButton'}
                        type='button' id='offer' value={true} onClick={onMutate}
                    >Yes</button>
                    <button
                        className={!offer && offer !== null ? 'formButtonActive': 'formButton'}
                        type='button' id='offer' value={false} onClick={onMutate}
                    >No</button>
                </div>
                <label className='formLabel'>Regular Price</label>
                <div className="formPriceDiv">
                    <input
                        className='formInputSmall'
                        type="number" 
                        id='regularPrice'
                        value={regularPrice}
                        onChange={onMutate}
                        min='50'
                        max='750000000'
                        required />
                    { type === 'rent' && (
                        <p className='formPriceText'>$ / Month</p>
                    )}
                </div>
                {offer && (
                    <>
                        <label className='formLabel'>Discounted Price</label>
                        <input type="number" className='formInputSmall' id='discountedPrice' onChange={onMutate} min='50' max='750000000' value={discountedPrice}  />
                    </>
                )}
                <label className='formLabel'>Images</label>
                <p className="imagesInfo">The first image will be the cover (max 6).</p>
                <input className='formInputFile' type="file" id='images' onChange={onMutate} max='6' accept='.jpg,.png,.jpeg' multiple required />
                <button type='submit' className='primaryButton createListingButton'>Create Listing</button>
            </form>
        </main>
    </div>
  )
}

export default CreateListing