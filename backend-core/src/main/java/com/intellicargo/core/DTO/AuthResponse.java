package com.intellicargo.core.DTO;

public class AuthResponse {
    private String token;
    private String email;
    private String role;
    private String fullName;

    public AuthResponse(String token, String email, String role, String fullName) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.fullName = fullName;
    }

    public String getToken() { return token; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getFullName() { return fullName; }
}
