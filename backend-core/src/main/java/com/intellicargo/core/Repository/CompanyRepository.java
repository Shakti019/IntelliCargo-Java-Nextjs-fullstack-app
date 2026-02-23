package com.intellicargo.core.Repository;

import com.intellicargo.core.Model.CompanyModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<CompanyModel, Long> {
    
    // Find company by name
    Optional<CompanyModel> findByName(String name);
    
    // Find companies by country
    List<CompanyModel> findByCountry(String country);
    
    // Find companies by status
    List<CompanyModel> findByStatus(String status);
    
    // Find company by registration number
    Optional<CompanyModel> findByRegistrationNumber(String registrationNumber);
    
    // Find companies by name containing (case-insensitive search)
    List<CompanyModel> findByNameContainingIgnoreCase(String name);
    
    // Check if company exists by name
    boolean existsByName(String name);
    
    // Check if company exists by registration number
    boolean existsByRegistrationNumber(String registrationNumber);
}
