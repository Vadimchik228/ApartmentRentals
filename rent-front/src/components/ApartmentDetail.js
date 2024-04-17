import React, { useState, useEffect, useRef } from 'react';
import { useParams} from 'react-router-dom';
import { useNavigate } from "react-router-dom"
import { getApartment } from '../api/ApartmentService';
import { toastError, toastSuccess } from '../api/ToastService';

const ApartmentDetail = ({ updateApartment, updateImage, deleteApartment, currentPage, 
    selectedFilters, selectedSortOption, totalElements, getApartments}) => {
    const inputRef = useRef();
    const [apartment, setApartment] = useState({
        id: '',
        name: '',
        price: '',
        square: '',
        numberOfBedrooms: '',
        freeWiFi: '',
        conditioner: '',
        bathroom: '',
        photoUrl: ''
    });

    const { id } = useParams();

    const fetchApartment = async (id) => {
        try {
            const { data } = await getApartment(id);
            setApartment(data);
            console.log(data);
            //toastSuccess('Apartment retrieved');
        } catch (error) {
            console.log(error);
            toastError(error.message);
        }
    };

    const selectImage = () => {
        inputRef.current.click();
    };

    const udpatePhoto = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file, file.name);
            formData.append('id', id);
            await updateImage(formData);
            setApartment((prev) => ({ ...prev, photoUrl: `${prev.photoUrl}?updated_at=${new Date().getTime()}` }));
            fetchApartment(id);
            toastSuccess('Photo updated');
        } catch (error) {
            console.log(error);
            toastError(error.message);
        }
    };

    const onChange = (event) => {
        setApartment({ ...apartment, [event.target.name]: event.target.value });
    };

    const onUpdateApartment = async (event) => {
        event.preventDefault();
        await updateApartment(apartment);        
        fetchApartment(id);
        toastSuccess('Apartment Updated');
    };

    const size = 10;
    const navigate = useNavigate();
    const onReturn = async (curNumberOfElements) => {
        if (curNumberOfElements > 0 && curNumberOfElements % size == 0) {
            await getApartments(currentPage - 1, size, selectedFilters, selectedSortOption);
        } else {
            await getApartments(currentPage, size, selectedFilters, selectedSortOption);
        }
        navigate('/apartments');
    }

    const onDeleteApartment = async () => {
        try {
            await deleteApartment(id);  
            onReturn(totalElements - 1);
            toastSuccess('Apartment Deleted');
        } catch (error) {
            console.log(error);
            toastError(error.message);
        }
    };
    
    useEffect(() => {
        fetchApartment(id);
    }, []);

    return (
        <>
            <button onClick={(totalElements) => onReturn(totalElements)}><i className='bi bi-arrow-left'></i> Back to list</button>
            <div className='profile'>
                <div className='profile__details'>
                    <img src={apartment.photoUrl} alt={`Profile photo of ${apartment.name}`} />
                    <div className='profile__metadata'>
                        <p className='profile__name'>{apartment.name}</p>
                        <p className='profile__muted'>JPG, GIF, or PNG. Max size of 10MG</p>
                        <button onClick={selectImage} className='btn'><i className='bi bi-cloud-upload'></i> Change Photo</button>
                    </div>
                </div>
                <div className='profile__settings'>
                    <div>
                        <form onSubmit={onUpdateApartment} className="form">
                            <div className="user-details">
                                <input type="hidden" defaultValue={apartment.id} name="id" required />
                                <div className="input-box">
                                    <span className="details">Name</span>
                                    <input type="text" value={apartment.name} onChange={onChange} name="name" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Price</span>
                                    <input type="text" value={apartment.price} onChange={onChange} name="price" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Square</span>
                                    <input type="text" value={apartment.square} onChange={onChange} name="square" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Number of bedrooms</span>
                                    <input type="text" value={apartment.numberOfBedrooms} onChange={onChange} name="numberOfBedrooms" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Free Wi-Fi</span>
                                    <input type="text" value={apartment.freeWiFi} onChange={onChange} name="freeWiFi" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Conditioner</span>
                                    <input type="text" value={apartment.conditioner} onChange={onChange} name="conditioner" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Bathroom</span>
                                    <input type="text" value={apartment.bathroom} onChange={onChange} name="bathroom" required />
                                </div>
                            </div>
                            <div className="form_footer">
                                <button type="submit" className="btn">Save</button>
                                <button type="button" className="btn btn-danger" onClick={onDeleteApartment}>Delete</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        
            <form style={{ display: 'none' }}>
                <input type='file' ref={inputRef} onChange={(event) => udpatePhoto(event.target.files[0])} name='file' accept='image/*' />
            </form>
        </>
    )
}

export default ApartmentDetail;