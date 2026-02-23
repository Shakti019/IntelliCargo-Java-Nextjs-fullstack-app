package com.intellicargo.core.Controller;

import com.intellicargo.core.DTO.CompanyDto;
import com.intellicargo.core.Service.CompanyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    // Get current user's company details
    @GetMapping("/my-company")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CompanyDto> getMyCompany(Authentication authentication) {
        // Any authenticated user should see their own company details
        CompanyDto company = companyService.getCompanyForUser(authentication.getName());
        if (company == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(company);
    }

    // Create a new company
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CompanyDto> createCompany(@RequestBody CompanyDto companyDto, Authentication authentication) {
        CompanyDto created = companyService.createCompany(authentication.getName(), companyDto);
        return ResponseEntity.ok(created);
    }

    // Update current user's company details
    @PutMapping("/my-company")
    @PreAuthorize("isAuthenticated()") // Any authenticated user can update their own company
    public ResponseEntity<CompanyDto> updateMyCompany(@RequestBody CompanyDto companyDto, Authentication authentication) {
        CompanyDto updated = companyService.updateMyCompany(authentication.getName(), companyDto);
        return ResponseEntity.ok(updated);
    }

    // Platform Admin: Update any company
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('SUSPEND_ACCOUNT')") // Platform Admin check (using unique permission)
    public ResponseEntity<CompanyDto> updateCompany(@PathVariable Long id, @RequestBody CompanyDto companyDto) {
        CompanyDto updated = companyService.updateCompany(id, companyDto);
        return ResponseEntity.ok(updated);
    }

    // List all companies (accessible to all authenticated users for trade/marketplace features)
    @GetMapping("/all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CompanyDto>> getAllCompanies() {
        return ResponseEntity.ok(companyService.getAllCompanies());
    }
}
