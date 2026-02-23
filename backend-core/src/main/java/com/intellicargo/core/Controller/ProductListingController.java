package com.intellicargo.core.Controller;

import com.intellicargo.core.DTO.ProductListingDto;
import com.intellicargo.core.Model.ProductListingModel.ListingStatus;
import com.intellicargo.core.Service.ProductListingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/product-listings")
public class ProductListingController {

    private final ProductListingService productListingService;

    public ProductListingController(ProductListingService productListingService) {
        this.productListingService = productListingService;
    }

    // Create a new product listing
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProductListingDto> createListing(@RequestBody ProductListingDto listingDto,
                                                          Authentication authentication) {
        ProductListingDto created = productListingService.createListing(authentication.getName(), listingDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Get listing by ID
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProductListingDto> getListingById(@PathVariable UUID id) {
        ProductListingDto listing = productListingService.getListingById(id);
        return ResponseEntity.ok(listing);
    }

    // Get all listings for current user's company
    @GetMapping("/my-company")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ProductListingDto>> getMyCompanyListings(Authentication authentication) {
        List<ProductListingDto> listings = productListingService.getMyCompanyListings(authentication.getName());
        return ResponseEntity.ok(listings);
    }

    // Get all valid open listings (marketplace)
    @GetMapping("/marketplace")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ProductListingDto>> getMarketplaceListings() {
        List<ProductListingDto> listings = productListingService.getMarketplaceListings();
        return ResponseEntity.ok(listings);
    }

    // Get listings by product ID
    @GetMapping("/product/{productId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ProductListingDto>> getListingsByProductId(@PathVariable UUID productId) {
        List<ProductListingDto> listings = productListingService.getListingsByProductId(productId);
        return ResponseEntity.ok(listings);
    }

    // Search listings with filters
    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ProductListingDto>> searchListings(
            @RequestParam(required = false) Long companyId,
            @RequestParam(required = false) String currency,
            @RequestParam(required = false) String incoterm,
            @RequestParam(required = false) ListingStatus status) {
        List<ProductListingDto> listings = productListingService.searchListings(companyId, currency, incoterm, status);
        return ResponseEntity.ok(listings);
    }

    // Update listing
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProductListingDto> updateListing(@PathVariable UUID id,
                                                          @RequestBody ProductListingDto listingDto,
                                                          Authentication authentication) {
        ProductListingDto updated = productListingService.updateListing(authentication.getName(), id, listingDto);
        return ResponseEntity.ok(updated);
    }

    // Close listing
    @PatchMapping("/{id}/close")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> closeListing(@PathVariable UUID id, Authentication authentication) {
        productListingService.closeListing(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }

    // Delete listing
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteListing(@PathVariable UUID id, Authentication authentication) {
        productListingService.deleteListing(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
