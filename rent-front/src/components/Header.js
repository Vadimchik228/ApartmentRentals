import React, { useState } from 'react';
import { toastError} from '../api/ToastService';

const Header = ({ toggleModal, nbOfApartments, getApartments}) => {

  const size = 10;

  const [selectedFilters, setSelectedFilters] = useState({
    byFreeWifi: false,
    byConditioner: false,
    byBathroom: false
  });

  const [selectedSortOption, setSelectedSortOption] = useState('standart');

  const handleFilterChange = async (key) => {
    try {
      setSelectedFilters(selectedFilters => ({
        ...selectedFilters,
        [key]: !selectedFilters[key]
      }));

      const newFilters = {
        ...selectedFilters,
        [key]: !selectedFilters[key]
      };

      await getApartments(0, size, newFilters, selectedSortOption);
    } catch (error) {
        console.log(error);
        toastError(error.message);
    }
  };

  const handleSortOptionChange = async (option) => {
    try {
      setSelectedSortOption(option);
      await getApartments(0, size, selectedFilters, option);
    } catch (error) {
        console.log(error);
        toastError(error.message);
    }
  };

  return (
    <header className='header'>
      <div className='headline'>SOME HOTEL</div>
      <div className='container'>
        <h3>Apartment List ({nbOfApartments})</h3>
        <div className='filters'>
          <div className='filter-options'>
            <label>
              <input
                type='checkbox'
                checked={selectedFilters.byFreeWifi}
                onChange={() =>
                  handleFilterChange('byFreeWifi')
                }
              />
              With Free Wi-fi
            </label>
            <label>
              <input
                type='checkbox'
                checked={selectedFilters.byConditioner}
                onChange={() =>
                  handleFilterChange('byConditioner')
                }
              />
              With Conditioner
            </label>
            <label>
              <input
                type='checkbox'
                checked={selectedFilters.byBathroom}
                onChange={() =>
                  handleFilterChange('byBathroom')
                }
              />
              With Bathroom
            </label>
          </div>
          <div className='sort-options'>
            <label>
              Sort By:
              <select
                value={selectedSortOption}
                onChange={(e) => handleSortOptionChange(e.target.value)}
              >
                <option value='standart'>Standart</option>
                <option value='priceAsc'>Price Asc</option>
                <option value='priceDesc'>Price Desc</option>
                <option value='squareAsc'>Square Asc</option>
                <option value='squareDesc'>Square Desc</option>
                <option value='numberOfBedroomsAsc'>Number of Bedrooms Asc</option>
                <option value='numberOfBedroomsDesc'>Number of Bedrooms Desc</option>
              </select>
            </label>
          </div>
        </div>
        <button onClick={() => toggleModal(true)} className='btn'>
          <i className='bi bi-plus-square'></i> Add New Apartment
        </button>
      </div>
    </header>
  );
};

export default Header

