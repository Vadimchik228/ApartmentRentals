import React from 'react'
import { Link } from 'react-router-dom'

const Apartment = ({ apartment }) => {
  return (
    <Link to={`/apartments/${apartment.id}`} className="apartment_item">
            <div className="apartment_header">
                <div className="apartment_image">
                    <img src={apartment.photoUrl} alt={apartment.name}  />
                </div>
                <div className="apartment_details">
                    <p className="apartment_name">{apartment.name.substring(0, 31)}</p>
                    <p>Price: {apartment.price} $</p>
                    <p>Square: {apartment.square} m^2</p>
                    <p>Bedrooms: {apartment.numberOfBedrooms}</p>
                    <p>{apartment.freeWiFi === true ? <i className='bi bi-wifi'></i> : 
                        <i className='bi bi-x-circle'></i>} Free Wi-Fi</p>
                    <p>{apartment.conditioner === true ? <i className='bi bi-snow'></i> : 
                        <i className='bi bi-x-circle'></i>} Conditioner</p>
                    <p>{apartment.bathroom === true ? <i className='bi bi-droplet'></i> : 
                        <i className='bi bi-x-circle'></i>} Bathroom</p>
                </div>
            </div>
        </Link>
  )
}

export default Apartment