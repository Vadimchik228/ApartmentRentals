package com.lab.rent.service;

import com.lab.rent.entity.Apartment;
import com.lab.rent.filter.ApartmentsFilter;
import com.lab.rent.repository.ApartmentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.function.BiFunction;
import java.util.function.Function;

import static com.lab.rent.constant.Constant.PHOTO_DIRECTORY;
import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class ApartmentService {
    private final ApartmentRepository apartmentRepository;

    public Page<Apartment> getApartments(int page, int size, ApartmentsFilter filter, Sort sort) {

        return apartmentRepository.findApartmentsByFilter(
                filter.getFreeWiFi(),
                filter.getConditioner(),
                filter.getBathroom(),
                PageRequest.of(page, size, sort)
        );
    }

    public Apartment getApartmentById(String id) {
        return apartmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Apartment not found"));
    }

    public Apartment createApartment(Apartment apartment) {
        return apartmentRepository.save(apartment);
    }

    public void deleteApartmentById(String id) {
        if (!apartmentRepository.existsById(id)) {
            throw new RuntimeException("Apartment cannot be deleted.");
        }
        apartmentRepository.deleteById(id);
    }

    public String uploadPhoto(String id, MultipartFile file) {
        log.info("Saving picture for apartment ID: {}", id);
        Apartment apartment = getApartmentById(id);
        String photoUrl = photoFunction.apply(id, file);
        apartment.setPhotoUrl(photoUrl);
        apartmentRepository.save(apartment);
        return photoUrl;
    }

    private final Function<String, String> fileExtension = fileName -> Optional.of(fileName)
            .filter(name -> name.contains("."))
            .map(name -> "." + name.substring(fileName.lastIndexOf(".") + 1))
            .orElse(".png");

    private final BiFunction<String, MultipartFile, String> photoFunction = (id, image) -> {
        String fileName = id + fileExtension.apply(image.getOriginalFilename());
        try {
            Path fileStorageLocation = Paths.get(PHOTO_DIRECTORY).toAbsolutePath().normalize();
            if (!Files.exists(fileStorageLocation)) {
                Files.createDirectories(fileStorageLocation);
            }
            Files.copy(image.getInputStream(), fileStorageLocation.resolve(fileName), REPLACE_EXISTING);
            return ServletUriComponentsBuilder.
                    fromCurrentContextPath()
                    .path("/apartments/image/" + fileName).toUriString();
        } catch (Exception exception) {
            throw new RuntimeException("Unable to save image");
        }
    };
}
