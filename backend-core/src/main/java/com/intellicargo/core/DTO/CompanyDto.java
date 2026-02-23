package com.intellicargo.core.DTO;

public class CompanyDto {
    private Long id;
    private String name;
    private String registrationNumber;
    private String country;
    private String city;
    private String industry;
    private String email;
    private String phone;
    private String website;
    private String status;

    public CompanyDto() {}

    public CompanyDto(Long id, String name, String registrationNumber, String country, String city, 
                     String industry, String email, String phone, String website, String status) {
        this.id = id;
        this.name = name;
        this.registrationNumber = registrationNumber;
        this.country = country;
        this.city = city;
        this.industry = industry;
        this.email = email;
        this.phone = phone;
        this.website = website;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String rn) { this.registrationNumber = rn; }
    
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
