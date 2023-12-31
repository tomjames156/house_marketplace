import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import Spinner from "../components/Spinner"
import ListingItem from "../components/ListingItem"


function Category() {
    const [listings, setListings] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { categoryName } = useParams()

    const deleteListing = (id, name) => {
        console.log(`Deleted Listing ${name} listing [${id}]`)
    }

    const fetchListings = async () => {
        setIsLoading(true)
        try{
            // Get doc Ref
            const collectionRef = collection(db, 'listings')
            const q = query(collectionRef, 
                where('type', '==', categoryName), 
                orderBy("timestamp", 'desc'), 
                limit(10))

            const querySnapShot = await getDocs(q)

            const listings = []

            querySnapShot.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })

            setListings(listings)
        }catch(err){
            toast.error("Failed to fetch listings 🥲")
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchListings()
    }, [])

  return (
    <>
        <div className="category">
            <div className="pageHeader">
                Places for {categoryName}
            </div>
            {isLoading ?
            <Spinner/> :
            listings && listings.length > 0 ?
            <>
                <main>
                    <p>{listings.length} listings for {categoryName}</p>
                    <ul className="categoryListings">
                        {listings.map((listing) => {
                            return (
                            <div key={listing.id}>
                                <ListingItem listing={listing.data} id={listing.id}/>
                            </div>)
                        })}
                    </ul>
                </main>
            </> : 
            <p>No listings for {categoryName}</p>
            }
        </div>
    </>
  )
}

export default Category