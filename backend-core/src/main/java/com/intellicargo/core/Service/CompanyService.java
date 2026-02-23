package com.intellicargo.core.Service;

import com.intellicargo.core.DTO.CompanyDto;
import com.intellicargo.core.Model.CompanyModel;
import com.intellicargo.core.Model.UserModel;
import com.intellicargo.core.Model.UserCompanyRoleModel;
import com.intellicargo.core.Repository.CompanyRepository;
import com.intellicargo.core.Repository.UserCompanyRoleRepository;
import com.intellicargo.core.Repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;
import java.util.List;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final UserCompanyRoleRepository userCompanyRoleRepository;

    public CompanyService(CompanyRepository companyRepository, UserRepository userRepository, UserCompanyRoleRepository userCompanyRoleRepository) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
        this.userCompanyRoleRepository = userCompanyRoleRepository;
    }

    public CompanyDto getCompanyForUser(String email) {
        UserModel user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        // Assuming a user belongs to one primary company for now
        // In a real multi-tenant app, we might need to handle multiple companies
        // But for MVP, let's grab the first non-null company associated with the user.
        
        Optional<UserCompanyRoleModel> role = userCompanyRoleRepository.findByUserAndIsPrimaryTrue(user);
        
        if (role.isPresent()) {
            CompanyModel company = role.get().getCompany();
            return mapToDto(company);
        }
        
        // Fallback or empty if user has no company assigned yet
        return null; 
    }

    public List<CompanyDto> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    public CompanyDto updateMyCompany(String email, CompanyDto companyDto) {
        UserModel user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserCompanyRoleModel role = userCompanyRoleRepository.findByUserAndIsPrimaryTrue(user)
                .orElseThrow(() -> new RuntimeException("User is not associated with any company"));

        // Ensure user has permission (handled by controller security usually via role)
        // But logic-wise, we only update the company linked to the user.
        CompanyModel company = role.getCompany();
        
        company.setName(companyDto.getName());
        company.setRegistrationNumber(companyDto.getRegistrationNumber());
        company.setCountry(companyDto.getCountry());
        company.setCity(companyDto.getCity());
        company.setIndustry(companyDto.getIndustry());
        company.setEmail(companyDto.getEmail());
        company.setPhone(companyDto.getPhone());
        company.setWebsite(companyDto.getWebsite());
        
        // Only allow status update if truly needed here or separate admin endpoint
        // For now, let's skip status update for self-update to prevent fraud.
        
        CompanyModel saved = companyRepository.save(company);
        return mapToDto(saved);
    }

    public CompanyDto updateCompany(Long companyId, CompanyDto companyDto) {
        // Platform Admin method
        CompanyModel company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        
        company.setName(companyDto.getName());
        company.setRegistrationNumber(companyDto.getRegistrationNumber());
        company.setCountry(companyDto.getCountry());
        company.setCity(companyDto.getCity());
        company.setIndustry(companyDto.getIndustry());
        company.setEmail(companyDto.getEmail());
        company.setPhone(companyDto.getPhone());
        company.setWebsite(companyDto.getWebsite());
        if(companyDto.getStatus() != null) {
            company.setStatus(companyDto.getStatus());
        }
        
        CompanyModel saved = companyRepository.save(company);
        return mapToDto(saved);
    }

    public CompanyDto createCompany(String email, CompanyDto companyDto) {
        // Create a new company for the authenticated user
        UserModel user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Create new company
        CompanyModel company = new CompanyModel();
        company.setName(companyDto.getName());
        company.setRegistrationNumber(companyDto.getRegistrationNumber());
        company.setCountry(companyDto.getCountry());
        company.setCity(companyDto.getCity());
        company.setIndustry(companyDto.getIndustry());
        company.setEmail(companyDto.getEmail());
        company.setPhone(companyDto.getPhone());
        company.setWebsite(companyDto.getWebsite());
        company.setStatus("PENDING"); // Default status for new companies
        
        CompanyModel saved = companyRepository.save(company);
        return mapToDto(saved);
    }

    private CompanyDto mapToDto(CompanyModel company) {
        return new CompanyDto(
                company.getId(),
                company.getName(),
                company.getRegistrationNumber(),
                company.getCountry(),
                company.getCity(),
                company.getIndustry(),
                company.getEmail(),
                company.getPhone(),
                company.getWebsite(),
                company.getStatus()
        );
    }
}
