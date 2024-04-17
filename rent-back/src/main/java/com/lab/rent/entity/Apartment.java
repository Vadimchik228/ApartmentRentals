package com.lab.rent.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_DEFAULT;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(NON_DEFAULT)
@Table(name = "apartment")
public class Apartment {
    @Id
    @UuidGenerator
    @Column(name = "id", unique = true, updatable = false)
    private String id;

    @Column(name = "name")
    private String name;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "square")
    private Double square;

    @Column(name = "numberOfBedrooms")
    private Integer numberOfBedrooms;

    @Column(name = "freeWiFi")
    private Boolean freeWiFi;

    @Column(name = "conditioner")
    private Boolean conditioner;

    @Column(name = "bathroom")
    private Boolean bathroom;

    @Column(name = "photoUrl")
    private String photoUrl;
}