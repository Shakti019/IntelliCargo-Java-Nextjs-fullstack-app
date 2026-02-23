package com.intellicargo.core.Security;

import com.intellicargo.core.DTO.AuthResponse;
import com.intellicargo.core.Model.CompanyModel;
import com.intellicargo.core.Model.RoleModel;
import com.intellicargo.core.Model.UserCompanyRoleModel;
import com.intellicargo.core.Model.UserModel;
import com.intellicargo.core.Repository.CompanyRepository;
import com.intellicargo.core.Repository.RoleRepository;
import com.intellicargo.core.Repository.UserCompanyRoleRepository;
import com.intellicargo.core.Repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Optional;

//@Component // Disabled - OAuth2 not in use, using JWT authentication only
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CompanyRepository companyRepository;
    private final UserCompanyRoleRepository userCompanyRoleRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public OAuth2LoginSuccessHandler(JwtService jwtService, 
                                     UserRepository userRepository,
                                     RoleRepository roleRepository,
                                     CompanyRepository companyRepository,
                                     UserCompanyRoleRepository userCompanyRoleRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.companyRepository = companyRepository;
        this.userCompanyRoleRepository = userCompanyRoleRepository;
    }

    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String googleId = oAuth2User.getAttribute("sub"); 

        Optional<UserModel> userOptional = userRepository.findByEmail(email);
        UserModel user;

        if (userOptional.isPresent()) {
            user = userOptional.get();
            if (user.getProvider() == null || user.getProvider() == UserModel.AuthProvider.LOCAL) {
                user.setProvider(UserModel.AuthProvider.GOOGLE);
                user.setProviderId(googleId);
                userRepository.save(user);
            }
        } else {
            // Register new OAuth user
            user = new UserModel();
            user.setEmail(email);
            user.setFullName(name);
            user.setProvider(UserModel.AuthProvider.GOOGLE);
            user.setProviderId(googleId);
            user.setReliabilityScore(5.0);
            user = userRepository.save(user);

            // Assign default role (IMPORTER) and create Company
            Optional<RoleModel> roleOpt = roleRepository.findByName("IMPORTER");
            
            if (roleOpt.isPresent()) {
                CompanyModel company = new CompanyModel();
                company.setName(name + "'s Company");
                company.setStatus("ACTIVE");
                company.setRegistrationNumber("PENDING");
                company.setCountry("UNKNOWN");
                company = companyRepository.save(company);

                UserCompanyRoleModel link = new UserCompanyRoleModel();
                link.setUser(user);
                link.setCompany(company);
                link.setRole(roleOpt.get());
                link.setPrimary(true);
                userCompanyRoleRepository.save(link);
            }
        }
        
        String primaryRole = userCompanyRoleRepository.findByUserAndIsPrimaryTrue(user)
                .map(ucr -> ucr.getRole().getName())
                .orElse("Guest");

        var userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password("") 
                .authorities(new ArrayList<>()) 
                .build();
        
        String token = jwtService.generateToken(userDetails);
        
        // Redirect to frontend with token, role, and fullName
        // Example: http://localhost:3000/auth/oauth-callback?token=...&role=...&name=...
        // For REST strictness, JSON is better, but this is a handler for browser redirect usually.
        // Let's stick to redirect for OAuth flow convenience
        
        String encodedName = java.net.URLEncoder.encode(user.getFullName() != null ? user.getFullName() : "", "UTF-8");
        String targetUrl = "http://localhost:3000/auth/oauth-callback?token=" + token + "&role=" + primaryRole + "&name=" + encodedName;
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
