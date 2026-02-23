package com.intellicargo.core.Service;

import com.intellicargo.core.DTO.ProductListingDto;
import com.intellicargo.core.Model.CompanyModel;
import com.intellicargo.core.Model.ProductListingModel;
import com.intellicargo.core.Model.ProductListingModel.ListingStatus;
import com.intellicargo.core.Model.ProductModel;
import com.intellicargo.core.Model.UserCompanyRoleModel;
import com.intellicargo.core.Model.UserModel;
import com.intellicargo.core.Repository.CompanyRepository;
import com.intellicargo.core.Repository.ProductListingRepository;
import com.intellicargo.core.Repository.ProductRepository;
import com.intellicargo.core.Repository.UserCompanyRoleRepository;
import com.intellicargo.core.Repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductListingService {

    private final ProductListingRepository productListingRepository;
    private final ProductRepository productRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final UserCompanyRoleRepository userCompanyRoleRepository;

    public ProductListingService(ProductListingRepository productListingRepository,
                                ProductRepository productRepository,
                                CompanyRepository companyRepository,
                                UserRepository userRepository,
                                UserCompanyRoleRepository userCompanyRoleRepository) {
        this.productListingRepository = productListingRepository;
        this.productRepository = productRepository;
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
        this.userCompanyRoleRepository = userCompanyRoleRepository;
    }

    // Create a new product listing
    public ProductListingDto createListing(String userEmail, ProductListingDto listingDto) {
        UserModel user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserCompanyRoleModel userCompanyRole = userCompanyRoleRepository.findByUserAndIsPrimaryTrue(user)
                .orElseThrow(() -> new RuntimeException("User is not associated with any company"));

        CompanyModel company = userCompanyRole.getCompany();

        // Verify product belongs to the company
        ProductModel product = productRepository.findById(listingDto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getCompany().getId().equals(company.getId())) {
            throw new RuntimeException("Product does not belong to your company");
        }

        ProductListingModel listing = new ProductListingModel();
        listing.setProduct(product);
        listing.setCompany(company);
        listing.setAvailableQuantity(listingDto.getAvailableQuantity());
        listing.setMinOrderQuantity(listingDto.getMinOrderQuantity());
        listing.setMaxOrderQuantity(listingDto.getMaxOrderQuantity());
        listing.setPricePerUnit(listingDto.getPricePerUnit());
        listing.setCurrency(listingDto.getCurrency());
        listing.setIncoterm(listingDto.getIncoterm());
        listing.setPortOfLoading(listingDto.getPortOfLoading());
        listing.setValidUntil(listingDto.getValidUntil());
        listing.setListingStatus(listingDto.getListingStatus() != null ? listingDto.getListingStatus() : ListingStatus.OPEN);

        ProductListingModel saved = productListingRepository.save(listing);
        return mapToDto(saved);
    }

    // Get listing by ID
    public ProductListingDto getListingById(UUID id) {
        ProductListingModel listing = productListingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
        return mapToDto(listing);
    }

    // Get all listings for user's company
    public List<ProductListingDto> getMyCompanyListings(String userEmail) {
        UserModel user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserCompanyRoleModel userCompanyRole = userCompanyRoleRepository.findByUserAndIsPrimaryTrue(user)
                .orElseThrow(() -> new RuntimeException("User is not associated with any company"));

        return productListingRepository.findByCompany(userCompanyRole.getCompany())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Get all valid open listings (marketplace)
    public List<ProductListingDto> getMarketplaceListings() {
        return productListingRepository.findValidOpenListings(LocalDate.now())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Get listings by product ID
    public List<ProductListingDto> getListingsByProductId(UUID productId) {
        ProductModel product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return productListingRepository.findByProduct(product)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Search listings with filters
    public List<ProductListingDto> searchListings(Long companyId, String currency, String incoterm, ListingStatus status) {
        return productListingRepository.searchListings(companyId, currency, incoterm, status)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Update listing
    public ProductListingDto updateListing(String userEmail, UUID listingId, ProductListingDto listingDto) {
        UserModel user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        ProductListingModel listing = productListingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        // Verify user has access to this listing
        UserCompanyRoleModel userCompanyRole = userCompanyRoleRepository.findByUserAndIsPrimaryTrue(user)
                .orElseThrow(() -> new RuntimeException("User is not associated with any company"));

        if (!listing.getCompany().getId().equals(userCompanyRole.getCompany().getId())) {
            throw new RuntimeException("You don't have permission to update this listing");
        }

        listing.setAvailableQuantity(listingDto.getAvailableQuantity());
        listing.setMinOrderQuantity(listingDto.getMinOrderQuantity());
        listing.setMaxOrderQuantity(listingDto.getMaxOrderQuantity());
        listing.setPricePerUnit(listingDto.getPricePerUnit());
        listing.setCurrency(listingDto.getCurrency());
        listing.setIncoterm(listingDto.getIncoterm());
        listing.setPortOfLoading(listingDto.getPortOfLoading());
        listing.setValidUntil(listingDto.getValidUntil());
        if (listingDto.getListingStatus() != null) {
            listing.setListingStatus(listingDto.getListingStatus());
        }

        ProductListingModel updated = productListingRepository.save(listing);
        return mapToDto(updated);
    }

    // Close listing
    public void closeListing(String userEmail, UUID listingId) {
        UserModel user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        ProductListingModel listing = productListingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        // Verify user has access
        UserCompanyRoleModel userCompanyRole = userCompanyRoleRepository.findByUserAndIsPrimaryTrue(user)
                .orElseThrow(() -> new RuntimeException("User is not associated with any company"));

        if (!listing.getCompany().getId().equals(userCompanyRole.getCompany().getId())) {
            throw new RuntimeException("You don't have permission to close this listing");
        }

        listing.setListingStatus(ListingStatus.CLOSED);
        productListingRepository.save(listing);
    }

    // Delete listing
    public void deleteListing(String userEmail, UUID listingId) {
        UserModel user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        ProductListingModel listing = productListingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        // Verify user has access
        UserCompanyRoleModel userCompanyRole = userCompanyRoleRepository.findByUserAndIsPrimaryTrue(user)
                .orElseThrow(() -> new RuntimeException("User is not associated with any company"));

        if (!listing.getCompany().getId().equals(userCompanyRole.getCompany().getId())) {
            throw new RuntimeException("You don't have permission to delete this listing");
        }

        productListingRepository.delete(listing);
    }

    // Map entity to DTO
    private ProductListingDto mapToDto(ProductListingModel listing) {
        return new ProductListingDto(
                listing.getId(),
                listing.getProduct().getId(),
                listing.getProduct().getName(),
                listing.getCompany().getId(),
                listing.getCompany().getName(),
                listing.getAvailableQuantity(),
                listing.getMinOrderQuantity(),
                listing.getMaxOrderQuantity(),
                listing.getPricePerUnit(),
                listing.getCurrency(),
                listing.getIncoterm(),
                listing.getPortOfLoading(),
                listing.getValidUntil(),
                listing.getListingStatus(),
                listing.getCreatedAt(),
                listing.getUpdatedAt()
        );
    }
}
