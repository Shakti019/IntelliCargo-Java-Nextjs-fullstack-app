package com.intellicargo.core.Repository;

import com.intellicargo.core.Model.CompanyModel;
import com.intellicargo.core.Model.ProductListingModel;
import com.intellicargo.core.Model.ProductListingModel.ListingStatus;
import com.intellicargo.core.Model.ProductModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.UUID;
import java.util.List;

@Repository
public interface ProductListingRepository extends JpaRepository<ProductListingModel, UUID> {
    
    // Find listings by product
    List<ProductListingModel> findByProduct(ProductModel product);
    
    // Find listings by company
    List<ProductListingModel> findByCompany(CompanyModel company);
    
    // Find listings by company ID
    List<ProductListingModel> findByCompanyId(Long companyId);
    
    // Find listings by status
    List<ProductListingModel> findByListingStatus(ListingStatus status);
    
    // Find open listings
    List<ProductListingModel> findByListingStatusAndValidUntilAfter(ListingStatus status, LocalDate date);
    
    // Find listings by currency
    List<ProductListingModel> findByCurrency(String currency);
    
    // Find listings by incoterm
    List<ProductListingModel> findByIncoterm(String incoterm);
    
    // Find listings by port of loading
    List<ProductListingModel> findByPortOfLoading(String portOfLoading);
    
    // Find valid open listings (marketplace)
    @Query("SELECT pl FROM ProductListingModel pl WHERE " +
           "pl.listingStatus = 'OPEN' AND " +
           "pl.validUntil >= :currentDate")
    List<ProductListingModel> findValidOpenListings(@Param("currentDate") LocalDate currentDate);
    
    // Search listings with filters
    @Query("SELECT pl FROM ProductListingModel pl WHERE " +
           "(:companyId IS NULL OR pl.company.id = :companyId) AND " +
           "(:currency IS NULL OR pl.currency = :currency) AND " +
           "(:incoterm IS NULL OR pl.incoterm = :incoterm) AND " +
           "(:status IS NULL OR pl.listingStatus = :status)")
    List<ProductListingModel> searchListings(@Param("companyId") Long companyId,
                                             @Param("currency") String currency,
                                             @Param("incoterm") String incoterm,
                                             @Param("status") ListingStatus status);
}

