package com.intellicargo.core.DTO;

import com.intellicargo.core.Model.TradeRequestModel.TradeStatus;
import com.intellicargo.core.Model.TradeRequestModel.TradeType;
import com.intellicargo.core.Model.TradeRequestModel.Visibility;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class TradeRequestDto {
    private UUID id;
    private Integer createdByUserId;
    private String createdByUserName;
    private Long companyId;
    private String companyName;
    private UUID productId;
    private String productName;
    private String productCategory;
    private TradeType tradeType;
    private String title;
    private String description;
    private BigDecimal quantity;
    private String unitType;
    private BigDecimal budgetMin;
    private BigDecimal budgetMax;
    private String currency;
    private String originCountry;
    private String destinationCountry;
    private String preferredIncoterm;
    private TradeStatus tradeStatus;
    private Visibility visibility;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TradeRequestDto() {}

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Integer getCreatedByUserId() { return createdByUserId; }
    public void setCreatedByUserId(Integer createdByUserId) { this.createdByUserId = createdByUserId; }

    public String getCreatedByUserName() { return createdByUserName; }
    public void setCreatedByUserName(String createdByUserName) { this.createdByUserName = createdByUserName; }

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public UUID getProductId() { return productId; }
    public void setProductId(UUID productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductCategory() { return productCategory; }
    public void setProductCategory(String productCategory) { this.productCategory = productCategory; }

    public TradeType getTradeType() { return tradeType; }
    public void setTradeType(TradeType tradeType) { this.tradeType = tradeType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }

    public String getUnitType() { return unitType; }
    public void setUnitType(String unitType) { this.unitType = unitType; }

    public BigDecimal getBudgetMin() { return budgetMin; }
    public void setBudgetMin(BigDecimal budgetMin) { this.budgetMin = budgetMin; }

    public BigDecimal getBudgetMax() { return budgetMax; }
    public void setBudgetMax(BigDecimal budgetMax) { this.budgetMax = budgetMax; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getOriginCountry() { return originCountry; }
    public void setOriginCountry(String originCountry) { this.originCountry = originCountry; }

    public String getDestinationCountry() { return destinationCountry; }
    public void setDestinationCountry(String destinationCountry) { this.destinationCountry = destinationCountry; }

    public String getPreferredIncoterm() { return preferredIncoterm; }
    public void setPreferredIncoterm(String preferredIncoterm) { this.preferredIncoterm = preferredIncoterm; }

    public TradeStatus getTradeStatus() { return tradeStatus; }
    public void setTradeStatus(TradeStatus tradeStatus) { this.tradeStatus = tradeStatus; }

    public Visibility getVisibility() { return visibility; }
    public void setVisibility(Visibility visibility) { this.visibility = visibility; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // ── Backward-compat setters: accept old short field names from frontend ──

    /** Accepts both "BUY_PRODUCT" and the short alias "BUY"/"SELL" */
    public void setType(String type) {
        if (type == null) return;
        switch (type.toUpperCase()) {
            case "BUY"  -> this.tradeType = TradeType.BUY_PRODUCT;
            case "SELL" -> this.tradeType = TradeType.SELL_PRODUCT;
            default     -> {
                try { this.tradeType = TradeType.valueOf(type.toUpperCase()); }
                catch (IllegalArgumentException ignored) {}
            }
        }
    }

    /** Accepts both "unitType" and the short alias "unit" */
    public void setUnit(String unit) { this.unitType = unit; }

    /** Accepts both "budgetMax" and the short alias "budget" */
    public void setBudget(java.math.BigDecimal budget) { this.budgetMax = budget; }
}
