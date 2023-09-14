import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { getAuth } from 'firebase/auth'
import { getDocs, collection, orderBy, limit, where, query } from 'firebase/firestore'
import ListingItem from '../components/ListingItem'
import Spinner from '../components/Spinner'
import { db } from '../firebase.config'

function Offers() {
  const [listings, setListings] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const getOffers = async () => {
    setIsLoading(true)

    try{
      const docsRef = collection(db, 'listings')
      const q = query(docsRef, 
        where('offer', '==', true, 
        orderBy('timestamp', 'desc'),
        limit(10)
      ))
      const querySnapShot = await getDocs(q)

      const listings = []
      querySnapShot.forEach(listing => listings.push({
        id: listing.id,
        data: listing.data()
      }))

      setListings(listings)
    }catch(err){
      toast.error("Could not fetch listings")
    }

    setIsLoading(false)
  }

  useEffect(() => {
    getOffers()
  }, [])

  return (
    <>
        <div className="category">
            <div className="pageHeader">
                Offers
            </div>
            {isLoading ?
            <Spinner/> :
            listings && listings.length > 0 ?
            <>
                <main>
                    <ul className="categoryListings">
                        {listings.map((listing) => {
                            return (
                            <div>
                                <ListingItem listing={listing.data} id={listing.id}/>
                            </div>)
                        })}
                    </ul>
                </main>
            </> : 
            <p>No offers available 🥺</p>
            }
        </div>
    </>
  )
}

export default Offers