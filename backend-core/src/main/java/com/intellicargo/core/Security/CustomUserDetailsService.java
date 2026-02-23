package com.intellicargo.core.Security;

import com.intellicargo.core.Repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var user = userRepository.findByEmailIgnoreCase(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        Set<GrantedAuthority> authorities = new HashSet<>();
        
        if (user.getCompanyRoles() != null) {
            user.getCompanyRoles().forEach(ucr -> {
                if (ucr.getRole() != null && ucr.getRole().getPermissions() != null) {
                    ucr.getRole().getPermissions().forEach(perm -> {
                        authorities.add(new SimpleGrantedAuthority(perm.getName()));
                    });
                }
            });
        }

        return new User(
            user.getEmail(),
            user.getPasswordHash() != null ? user.getPasswordHash() : "", 
            authorities
        );
    }
}
