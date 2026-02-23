package com.intellicargo.core.Service;

import com.intellicargo.core.DTO.RegisterRequest;
import com.intellicargo.core.Model.CompanyModel;
import com.intellicargo.core.Model.RoleModel;
import com.intellicargo.core.Model.UserCompanyRoleModel;
import com.intellicargo.core.Model.UserModel;
import com.intellicargo.core.Repository.CompanyRepository;
import com.intellicargo.core.Repository.RoleRepository;
import com.intellicargo.core.Repository.UserCompanyRoleRepository;
import com.intellicargo.core.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CompanyRepository companyRepository;
    private final UserCompanyRoleRepository userCompanyRoleRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(UserRepository userRepository, 
                       RoleRepository roleRepository,
                       CompanyRepository companyRepository,
                       UserCompanyRoleRepository userCompanyRoleRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.companyRepository = companyRepository;
        this.userCompanyRoleRepository = userCompanyRoleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserModel registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already active: " + request.getEmail());
        }

        // 1. Create User
        UserModel user = new UserModel();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setCountry(request.getCountry());
        // Default Reliability Score
        user.setReliabilityScore(5.0);
        user = userRepository.save(user);

        // 2. Resolve Role — create it on-the-fly if the seeder hasn't run yet
        String roleName = (request.getRole() != null && !request.getRole().isEmpty())
                ? request.getRole().toUpperCase()
                : "SHIPPER";

        RoleModel role = roleRepository.findByName(roleName)
                .orElseGet(() -> {
                    RoleModel newRole = new RoleModel();
                    newRole.setName(roleName);
                    newRole.setScope("COMPANY");
                    return roleRepository.save(newRole);
                });

        // 3. Create/Find Company (Basic Implementation for Phase 1)
        // In real world, user might join existing company via invite code
        CompanyModel company = new CompanyModel();
        // Use provided company name or default
        company.setName(request.getCompanyName() != null && !request.getCompanyName().isEmpty() 
            ? request.getCompanyName() 
            : request.getFullName() + "'s Company");
        
        company.setRegistrationNumber("PENDING"); // Placeholder
        company.setCountry("UNKNOWN"); // Placeholder
        company.setStatus("ACTIVE");
        company = companyRepository.save(company);

        // 4. Link User to Company with Role
        UserCompanyRoleModel link = new UserCompanyRoleModel();
        link.setUser(user);
        link.setCompany(company);
        link.setRole(role);
        link.setPrimary(true);
        userCompanyRoleRepository.save(link);

        return user;
    }
}
