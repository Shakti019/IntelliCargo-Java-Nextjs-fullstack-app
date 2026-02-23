package com.intellicargo.core.Service;

import com.intellicargo.core.DTO.UserDto;
import com.intellicargo.core.DTO.UserCompanyRoleDto;
import com.intellicargo.core.Model.UserModel;
import com.intellicargo.core.Model.UserCompanyRoleModel;
import com.intellicargo.core.Repository.UserRepository;
import com.intellicargo.core.Repository.UserCompanyRoleRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserCompanyRoleRepository userCompanyRoleRepository;

    public UserService(UserRepository userRepository, UserCompanyRoleRepository userCompanyRoleRepository) {
        this.userRepository = userRepository;
        this.userCompanyRoleRepository = userCompanyRoleRepository;
    }

    public UserModel getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    public List<UserCompanyRoleModel> getUserRoles(UserModel user) {
        return userCompanyRoleRepository.findByUser(user);
    }
    
    public UserDto mapToDto(UserModel user) {
        UserDto dto = new UserDto();
        dto.setUserId(user.getUserId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setCountry(user.getCountry());
        dto.setProvider(user.getProvider() != null ? user.getProvider().name() : null);
        dto.setIsActive(user.isActive());
        dto.setLatitude(user.getLatitude());
        dto.setLongitude(user.getLongitude());
        dto.setPreferredTransportMode(user.getPreferredTransportMode());
        dto.setHandleCargoTypes(user.getHandleCargoTypes());
        dto.setReliabilityScore(user.getReliabilityScore());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        
        // Map company roles to DTOs to avoid circular reference
        if (user.getCompanyRoles() != null) {
            List<UserCompanyRoleDto> roleDtos = user.getCompanyRoles().stream()
                    .map(this::mapCompanyRoleToDto)
                    .collect(Collectors.toList());
            dto.setCompanyRoles(roleDtos);
        }
        
        return dto;
    }
    
    public UserCompanyRoleDto mapCompanyRoleToDto(UserCompanyRoleModel role) {
        return new UserCompanyRoleDto(
                role.getId(),
                role.getCompany() != null ? role.getCompany().getId() : null,
                role.getCompany() != null ? role.getCompany().getName() : null,
                role.getRole() != null ? role.getRole().getId() : null,
                role.getRole() != null ? role.getRole().getName() : null,
                role.isPrimary()
        );
    }
    
    // Additional service methods as needed for RBAC
}
