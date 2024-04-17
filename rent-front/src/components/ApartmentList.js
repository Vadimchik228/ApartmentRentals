import React from 'react';
import Apartment from './Apartment';

const ApartmentList = ({ data, currentPage, selectedFilters, selectedSortOption, getApartments }) => {
    const size = 10;
    return (
        <main className='main'>
            {data?.content?.length === 0 && <div>No Apartments. Please add a new apartment.</div>}

            <ul className='apartment_list'>
                {data?.content?.length > 0 && data.content.map(apartment => <Apartment apartment={apartment} key={apartment.id} />)}
            </ul>

            {data?.content?.length > 0 && data?.totalPages > 1 &&
            <div className='pagination'>
                <a onClick={() => getApartments(currentPage - 1, size, selectedFilters, selectedSortOption)} className={0 === currentPage ? 'disabled' : ''}>&laquo;</a>

                { data && [...Array(data.totalPages).keys()].map((page, index) => 
                    <a onClick={() => getApartments(page, size, selectedFilters, selectedSortOption)} className={currentPage === page ? 'active' : ''} key={page}>{page + 1}</a>)}


                <a onClick={() => getApartments(currentPage + 1, size, selectedFilters, selectedSortOption)} className={data.totalPages === currentPage + 1 ? 'disabled' : ''}>&raquo;</a>
            </div>            
            }

        </main>
    )
}

export default ApartmentList