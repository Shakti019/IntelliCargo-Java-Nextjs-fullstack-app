package com.intellicargo.core.DTO;

import com.intellicargo.core.Model.ProductListingModel.ListingStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class ProductListingDto {
    private UUID id;
    private UUID productId;
    private String productName;
    private Long companyId;
    private String companyName;
    private BigDecimal availableQuantity;
    private BigDecimal minOrderQuantity;
    private BigDecimal maxOrderQuantity;
    private BigDecimal pricePerUnit;
    private String currency;
    private String incoterm;
    private String portOfLoading;
    private LocalDate validUntil;
    private ListingStatus listingStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProductListingDto() {}

    public ProductListingDto(UUID id, UUID productId, String productName, Long companyId, String companyName,
                            BigDecimal availableQuantity, BigDecimal minOrderQuantity, BigDecimal maxOrderQuantity,
                            BigDecimal pricePerUnit, String currency, String incoterm, String portOfLoading,
                            LocalDate validUntil, ListingStatus listingStatus,
                            LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.companyId = companyId;
        this.companyName = companyName;
        this.availableQuantity = availableQuantity;
        this.minOrderQuantity = minOrderQuantity;
        this.maxOrderQuantity = maxOrderQuantity;
        this.pricePerUnit = pricePerUnit;
        this.currency = currency;
        this.incoterm = incoterm;
        this.portOfLoading = portOfLoading;
        this.validUntil = validUntil;
        this.listingStatus = listingStatus;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getProductId() { return productId; }
    public void setProductId(UUID productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public BigDecimal getAvailableQuantity() { return availableQuantity; }
    public void setAvailableQuantity(BigDecimal availableQuantity) { this.availableQuantity = availableQuantity; }

    public BigDecimal getMinOrderQuantity() { return minOrderQuantity; }
    public void setMinOrderQuantity(BigDecimal minOrderQuantity) { this.minOrderQuantity = minOrderQuantity; }

    public BigDecimal getMaxOrderQuantity() { return maxOrderQuantity; }
    public void setMaxOrderQuantity(BigDecimal maxOrderQuantity) { this.maxOrderQuantity = maxOrderQuantity; }

    public BigDecimal getPricePerUnit() { return pricePerUnit; }
    public void setPricePerUnit(BigDecimal pricePerUnit) { this.pricePerUnit = pricePerUnit; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getIncoterm() { return incoterm; }
    public void setIncoterm(String incoterm) { this.incoterm = incoterm; }

    public String getPortOfLoading() { return portOfLoading; }
    public void setPortOfLoading(String portOfLoading) { this.portOfLoading = portOfLoading; }

    public LocalDate getValidUntil() { return validUntil; }
    public void setValidUntil(LocalDate validUntil) { this.validUntil = validUntil; }

    public ListingStatus getListingStatus() { return listingStatus; }
    public void setListingStatus(ListingStatus listingStatus) { this.listingStatus = listingStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
