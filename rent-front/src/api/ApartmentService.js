import axios from "axios";

const API_URL = 'http://localhost:8080/apartments';

export async function saveApartment(apartment) {
    return await axios.post(API_URL, apartment);
}

export async function getApartments(page = 0, size = 10, selectedFilters, selectedSortOption) {
  
    let sortBy = 'name';
    let sortDirection = 'asc';
    
    if (selectedSortOption !== 'standart') {
      if (selectedSortOption === 'priceAsc' || selectedSortOption === 'priceDesc') {
        sortBy = 'price';
      } else if (selectedSortOption === 'squareAsc' || selectedSortOption === 'squareDesc') {
        sortBy = 'square';
      } else if (selectedSortOption === 'numberOfBedroomsAsc' || selectedSortOption === 'numberOfBedroomsDesc') {
        sortBy = 'numberOfBedrooms';
      }

      if (!(selectedSortOption === 'priceAsc' || selectedSortOption === 'squareAsc' || selectedSortOption === 'numberOfBedroomsAsc')) {
        sortDirection = 'desc';
      }
    }
    
    let url = `${API_URL}?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`;

    if (selectedFilters.byFreeWifi === true) {
      url += `&freeWiFi=${true}`;
    }
    
    if (selectedFilters.byConditioner === true) {
        url += `&conditioner=${true}`;
    }

    if (selectedFilters.byBathroom === true) {
        url += `&bathroom=${true}`;
    }
    
    console.log(url);

    return await axios.get(url);
}

export async function getApartment(id) {
    return await axios.get(`${API_URL}/${id}`);
}

export async function udpateApartment(apartment) {
    return await axios.post(API_URL, apartment);
}

export async function udpatePhoto(formData) {
    return await axios.put(`${API_URL}/photo`, formData);
}

export async function deleteApartment(id) {
    return await axios.delete(`${API_URL}/${id}`);
}