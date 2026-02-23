package com.intellicargo.core.Repository;

import com.intellicargo.core.Model.CompanyModel;
import com.intellicargo.core.Model.ProductModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<ProductModel, UUID> {
    
    // Find products by company
    List<ProductModel> findByCompany(CompanyModel company);
    
    // Find products by company ID
    List<ProductModel> findByCompanyId(Long companyId);
    
    // Find active products by company
    List<ProductModel> findByCompanyAndIsActiveTrue(CompanyModel company);
    
    // Find products by category
    List<ProductModel> findByCategory(String category);
    
    // Find products by category and active status
    List<ProductModel> findByCategoryAndIsActiveTrue(String category);
    
    // Find products by origin country
    List<ProductModel> findByOriginCountry(String originCountry);
    
    // Find products by HS code
    List<ProductModel> findByHsCode(String hsCode);
    
    // Find products by name (case-insensitive search)
    List<ProductModel> findByNameContainingIgnoreCase(String name);
    
    // Find products by company and category
    List<ProductModel> findByCompanyAndCategory(CompanyModel company, String category);
    
    // Check if product exists by company and name
    boolean existsByCompanyAndName(CompanyModel company, String name);
    
    // Find all active products
    List<ProductModel> findByIsActiveTrue();
    
    // Custom query to search products by multiple criteria
    @Query("SELECT p FROM ProductModel p WHERE " +
           "(:companyId IS NULL OR p.company.id = :companyId) AND " +
           "(:category IS NULL OR p.category = :category) AND " +
           "(:originCountry IS NULL OR p.originCountry = :originCountry) AND " +
           "(:isActive IS NULL OR p.isActive = :isActive)")
    List<ProductModel> searchProducts(@Param("companyId") Long companyId,
                                      @Param("category") String category,
                                      @Param("originCountry") String originCountry,
                                      @Param("isActive") Boolean isActive);
}

