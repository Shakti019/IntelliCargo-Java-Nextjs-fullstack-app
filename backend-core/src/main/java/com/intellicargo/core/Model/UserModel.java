package com.intellicargo.core.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "users")
public class UserModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private int userId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = true) 
    private String passwordHash; // Changed to nullable for OAuth users

    @Enumerated(EnumType.STRING)
    private AuthProvider provider;

    private String providerId; // Google ID

    private String fullName;
    
    // Removed old 'role' and 'companyName' fields in favor of relation tables
    // private String role; 
    // private String companyName;
    
    private String country;
    
    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    private Set<UserCompanyRoleModel> companyRoles;

    // --- Geolocation & Logistics Data (For AI Optimization) ---
    
    private Double latitude;
    private Double longitude;
    
    @Column(name = "last_location_update")
    private LocalDateTime lastLocationUpdate;

    // Preferences for matching algorithms
    private String preferredTransportMode; // e.g., SEA, AIR, ROAD
    private String handleCargoTypes;       // e.g., PERISHABLE, HAZARDOUS, STANDARD

    // Reputation Score (For matching reliability)
    @Column(columnDefinition = "double precision default 5.0")
    private Double reliabilityScore; 

    @Column(name = "is_active")
    private boolean isActive = true;
    
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum AuthProvider {
        LOCAL,
        GOOGLE
    }

    public enum UserRole {
        SHIPPER,
        CARRIER,
        TRADER,
        LOGISTICS_PARTNER,
        IMPORTER,
        EXPORTER,
        WAREHOUSE_MANAGER,
        ADMIN
    }

    // Getters and Setters

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public AuthProvider getProvider() {
        return provider;
    }

    public void setProvider(AuthProvider provider) {
        this.provider = provider;
    }

    public String getProviderId() {
        return providerId;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public Set<UserCompanyRoleModel> getCompanyRoles() {
        return companyRoles;
    }

    public void setCompanyRoles(Set<UserCompanyRoleModel> companyRoles) {
        this.companyRoles = companyRoles;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public LocalDateTime getLastLocationUpdate() {
        return lastLocationUpdate;
    }

    public void setLastLocationUpdate(LocalDateTime lastLocationUpdate) {
        this.lastLocationUpdate = lastLocationUpdate;
    }

    public String getPreferredTransportMode() {
        return preferredTransportMode;
    }

    public void setPreferredTransportMode(String preferredTransportMode) {
        this.preferredTransportMode = preferredTransportMode;
    }

    public String getHandleCargoTypes() {
        return handleCargoTypes;
    }

    public void setHandleCargoTypes(String handleCargoTypes) {
        this.handleCargoTypes = handleCargoTypes;
    }

    public Double getReliabilityScore() {
        return reliabilityScore;
    }

    public void setReliabilityScore(Double reliabilityScore) {
        this.reliabilityScore = reliabilityScore;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }


}