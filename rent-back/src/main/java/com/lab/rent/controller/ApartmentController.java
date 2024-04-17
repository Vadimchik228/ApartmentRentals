package com.lab.rent.controller;

import com.lab.rent.entity.Apartment;
import com.lab.rent.filter.ApartmentsFilter;
import com.lab.rent.service.ApartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Optional;

import static com.lab.rent.constant.Constant.PHOTO_DIRECTORY;
import static org.springframework.http.MediaType.IMAGE_JPEG_VALUE;
import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;

@RestController
@RequestMapping("/apartments")
@RequiredArgsConstructor
public class ApartmentController {

    private final ApartmentService apartmentService;
    private static final String PAGE_DEFAULT_VALUE = "0";
    private static final String SIZE_DEFAULT_VALUE = "10";
    private static final String SORT_BY_DEFAULT_FIELD = "name";
    private static final String DEFAULT_SORT_DIRECTION = "ASC";

    @PostMapping
    public ResponseEntity<Apartment> createApartment(@RequestBody Apartment apartment) {
        return ResponseEntity.created(URI.create("/apartments/apartmentID")).body(apartmentService.createApartment(apartment));
    }

    @GetMapping
    public ResponseEntity<Page<Apartment>> getApartments(@RequestParam(value = "page", defaultValue = PAGE_DEFAULT_VALUE) int page,
                                                         @RequestParam(value = "size", defaultValue = SIZE_DEFAULT_VALUE) int size,
                                                         @RequestParam(value = "sortBy", defaultValue = SORT_BY_DEFAULT_FIELD) String sortBy,
                                                         @RequestParam(value = "sortDirection", defaultValue = DEFAULT_SORT_DIRECTION) String sortDirection,
                                                         @RequestParam(value = "freeWiFi", required=false) Boolean freeWiFi,
                                                         @RequestParam(value = "conditioner", required=false) Boolean conditioner,
                                                         @RequestParam(value = "bathroom", required=false) Boolean bathroom) {
        ApartmentsFilter filter = new ApartmentsFilter();
        filter.setFreeWiFi(freeWiFi);
        filter.setConditioner(conditioner);
        filter.setBathroom(bathroom);
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        return ResponseEntity.ok().body(apartmentService.getApartments(page, size, filter, sort));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Apartment> getApartmentById(@PathVariable(value = "id") String id) {
        return ResponseEntity.ok().body(apartmentService.getApartmentById(id));
    }

    @PutMapping("/photo")
    public ResponseEntity<String> uploadPhoto(@RequestParam("id") String id, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok().body(apartmentService.uploadPhoto(id, file));
    }

    @GetMapping(path = "/image/{filename}", produces = {IMAGE_PNG_VALUE, IMAGE_JPEG_VALUE})
    public byte[] getPhoto(@PathVariable("filename") String filename) throws IOException {
        return Files.readAllBytes(Paths.get(PHOTO_DIRECTORY + filename));
    }

    @DeleteMapping("/{id}")
    public void deleteApartmentById(@PathVariable(value = "id") String id) {
        apartmentService.deleteApartmentById(id);
    }
}
