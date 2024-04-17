import { useEffect, useRef, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header'
import ApartmentList from './components/ApartmentList'
import { getApartments, saveApartment, udpatePhoto, deleteApartment } from './api/ApartmentService';
import { Routes, Route, Navigate } from 'react-router-dom';
import ApartmentDetail from './components/ApartmentDetail';
import { toastError} from './api/ToastService';
import { ToastContainer } from 'react-toastify';

function App() {
  const size = 10;

  const modalRef = useRef();
  const fileRef = useRef();
  const [data, setData] = useState({});
  const [filters, setFilters] = useState({
    byFreeWifi: false,
    byConditioner: false,
    byBathroom: false,
  });
  const [sorting, setSorting] = useState('standart');
  const [currentPage, setCurrentPage] = useState(0);
  const [file, setFile] = useState(undefined);
  const [values, setValues] = useState({
    name: '',
    price: '',
    square: '',
    numberOfBedrooms: '',
    freeWiFi: '',
    conditioner: '',
    bathroom: '',
  });

  
  const getApartmentsToPage = async (page = 0, size = 10, selectedFilters, selectedSortOption) => {
    try {
      setCurrentPage(page);
      const { data } = await getApartments(page, size, selectedFilters, selectedSortOption);
      setData(data);
      setFilters(selectedFilters);
      setSorting(selectedSortOption);
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleNewApartment = async (event) => {
    event.preventDefault();
    try {
      const { data } = await saveApartment(values);
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('id', data.id);
      const { data: photoUrl } = await udpatePhoto(formData);
      toggleModal(false);
      setFile(undefined);
      fileRef.current.value = null;
      setValues({
        name: '',
        email: '',
        phone: '',
        address: '',
        title: '',
        status: '',
      })
      getApartmentsToPage(currentPage, size, filters, sorting);
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const updateApartment = async (apartment) => {
    try {
      const { data } = await saveApartment(apartment);
      console.log(data);
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const delApartment = async (id) => {
    try {
      await deleteApartment(id);
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const updateImage = async (formData) => {
    try {
      await udpatePhoto(formData);
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const toggleModal = show => show ? modalRef.current.showModal() : modalRef.current.close();

  useEffect(() => {
    getApartmentsToPage(currentPage, size, filters, sorting);
  }, []);

  return (
    <>
      <Header toggleModal={toggleModal} nbOfApartments={data.totalElements} getApartments={getApartmentsToPage}/>
      <main className='main'>
        <div className='container'>
          <Routes>
            <Route path='/' element={<Navigate to={'/apartments'} />} />
            <Route path="/apartments" element={<ApartmentList data={data} currentPage={currentPage} getApartments={getApartmentsToPage} 
              selectedFilters={filters} selectedSortOption={sorting} />} />
            <Route path="/apartments/:id" element={<ApartmentDetail updateApartment={updateApartment} totalElements={data.totalElements}
              updateImage={updateImage} deleteApartment={delApartment} currentPage={currentPage} getApartments={getApartmentsToPage}
              selectedFilters={filters} selectedSortOption={sorting} />} />
          </Routes>
        </div>
      </main>

      {/* Modal */}
      <dialog ref={modalRef} className="modal" id="modal">
        <div className="modal__header">
          <h3>New Apartment</h3>
          <i onClick={() => toggleModal(false)} className="bi bi-x-lg"></i>
        </div>
        <div className="divider"></div>
        <div className="modal__body">
          <form onSubmit={handleNewApartment}>
            <div className="user-details">
              <div className="input-box">
                  <span className="details">Name</span>
                  <input type="text" value={values.name} onChange={onChange} name="name" required />
              </div>
              <div className="input-box">
                  <span className="details">Price</span>
                  <input type="text" value={values.price} onChange={onChange} name="price" required />
              </div>
              <div className="input-box">
                  <span className="details">Square</span>
                  <input type="text" value={values.square} onChange={onChange} name="square" required />
              </div>
              <div className="input-box">
                  <span className="details">Number of bedrooms</span>
                  <input type="text" value={values.numberOfBedrooms} onChange={onChange} name="numberOfBedrooms" required />
              </div>
              <div className="input-box">
                  <span className="details">Free Wi-Fi</span>
                  <input type="text" value={values.freeWiFi} onChange={onChange} name="freeWiFi" required />
              </div>
              <div className="input-box">
                  <span className="details">Conditioner</span>
                  <input type="text" value={values.conditioner} onChange={onChange} name="conditioner" required />
              </div>
              <div className="input-box">
                  <span className="details">Bathroom</span>
                  <input type="text" value={values.bathroom} onChange={onChange} name="bathroom" required />
              </div>              
              <div className="file-input">
                <span className="details">Profile Photo</span>
                <input type="file" onChange={(event) => setFile(event.target.files[0])} ref={fileRef} name='photo' required />
              </div>
            </div>
            <div className="form_footer">
              <button onClick={() => toggleModal(false)} type='button' className="btn btn-danger">Cancel</button>
              <button type='submit' className="btn">Save</button>
            </div>
          </form>
        </div>
      </dialog>
      <ToastContainer />
    </>
  );
}

export default App;
