package com.intellicargo.core.Controller;

import com.intellicargo.core.DTO.UserDto;
import com.intellicargo.core.DTO.UserCompanyRoleDto;
import com.intellicargo.core.Model.UserModel;
import com.intellicargo.core.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Get current user profile (Authenticated users)
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDto> getCurrentUser(Authentication authentication) {
        UserModel user = userService.getUserByEmail(authentication.getName());
        UserDto userDto = userService.mapToDto(user);
        return ResponseEntity.ok(userDto);
    }

    // Get roles for current user
    @GetMapping("/me/roles")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<UserCompanyRoleDto>> getCurrentUserRoles(Authentication authentication) {
        UserModel user = userService.getUserByEmail(authentication.getName());
        List<UserCompanyRoleDto> roles = userService.getUserRoles(user).stream()
                .map(role -> userService.mapCompanyRoleToDto(role))
                .collect(Collectors.toList());
        return ResponseEntity.ok(roles);
    }

    // Admin only endpoint to list all users (placeholder)
    @GetMapping("/admin/all")
    @PreAuthorize("hasAuthority('MANAGE_USERS')") // Using Authority for fine-grained permission
    public ResponseEntity<String> getAllUsers() {
        return ResponseEntity.ok("Admin access granted: Listing all users...");
    }
}
