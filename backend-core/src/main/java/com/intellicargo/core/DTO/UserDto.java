package com.intellicargo.core.DTO;

import java.time.LocalDateTime;
import java.util.List;

public class UserDto {
    private Integer userId;
    private String email;
    private String fullName;
    private String country;
    private String provider;
    private Boolean isActive;
    private Double latitude;
    private Double longitude;
    private String preferredTransportMode;
    private String handleCargoTypes;
    private Double reliabilityScore;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<UserCompanyRoleDto> companyRoles;

    public UserDto() {}

    // Getters and Setters
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getPreferredTransportMode() { return preferredTransportMode; }
    public void setPreferredTransportMode(String preferredTransportMode) { this.preferredTransportMode = preferredTransportMode; }

    public String getHandleCargoTypes() { return handleCargoTypes; }
    public void setHandleCargoTypes(String handleCargoTypes) { this.handleCargoTypes = handleCargoTypes; }

    public Double getReliabilityScore() { return reliabilityScore; }
    public void setReliabilityScore(Double reliabilityScore) { this.reliabilityScore = reliabilityScore; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<UserCompanyRoleDto> getCompanyRoles() { return companyRoles; }
    public void setCompanyRoles(List<UserCompanyRoleDto> companyRoles) { this.companyRoles = companyRoles; }
}
