package com.lab.rent.repository;

import com.lab.rent.entity.Apartment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ApartmentRepository extends JpaRepository<Apartment, String> {
    @Query("SELECT a  FROM Apartment a WHERE " +
            "(?1 IS NULL OR a.freeWiFi = ?1) AND " +
            "(?2 IS NULL OR a.conditioner = ?2) AND " +
            "(?3 IS NULL OR a.bathroom = ?3)")
    Page<Apartment> findApartmentsByFilter(
            Boolean freeWiFi,
            Boolean conditioner,
            Boolean bathroom,
            Pageable pageable
    );

}
