package com.intellicargo.core.DTO;

public class RegisterRequest {
    private String email;
    private String password;
    private String fullName;
    private String country;
    private String role; 
    private String companyName;

    public RegisterRequest() {}

    public RegisterRequest(String email, String password, String fullName, String country, String role, String companyName) {
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.country = country;
        this.role = role;
        this.companyName = companyName;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
}
