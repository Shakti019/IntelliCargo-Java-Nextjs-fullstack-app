package com.intellicargo.core.DTO;

import com.intellicargo.core.Model.TradeOfferModel.OfferStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class TradeOfferDto {
    private UUID id;
    private UUID tradeRequestId;
    private String tradeRequestTitle;
    private Long tradeRequestCompanyId;
    private String tradeRequestCompanyName;
    private Long offeredByCompanyId;
    private String offeredByCompanyName;
    private Integer offeredByUserId;
    private String offeredByUserName;
    private BigDecimal offeredPrice;
    private BigDecimal offeredQuantity;
    private String unitType;
    private String currency;
    private Integer estimatedDeliveryDays;
    private String additionalTerms;
    private OfferStatus offerStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TradeOfferDto() {}

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getTradeRequestId() { return tradeRequestId; }
    public void setTradeRequestId(UUID tradeRequestId) { this.tradeRequestId = tradeRequestId; }

    public String getTradeRequestTitle() { return tradeRequestTitle; }
    public void setTradeRequestTitle(String tradeRequestTitle) { this.tradeRequestTitle = tradeRequestTitle; }

    public Long getTradeRequestCompanyId() { return tradeRequestCompanyId; }
    public void setTradeRequestCompanyId(Long tradeRequestCompanyId) { this.tradeRequestCompanyId = tradeRequestCompanyId; }

    public String getTradeRequestCompanyName() { return tradeRequestCompanyName; }
    public void setTradeRequestCompanyName(String tradeRequestCompanyName) { this.tradeRequestCompanyName = tradeRequestCompanyName; }

    public Long getOfferedByCompanyId() { return offeredByCompanyId; }
    public void setOfferedByCompanyId(Long offeredByCompanyId) { this.offeredByCompanyId = offeredByCompanyId; }

    public String getOfferedByCompanyName() { return offeredByCompanyName; }
    public void setOfferedByCompanyName(String offeredByCompanyName) { this.offeredByCompanyName = offeredByCompanyName; }

    public Integer getOfferedByUserId() { return offeredByUserId; }
    public void setOfferedByUserId(Integer offeredByUserId) { this.offeredByUserId = offeredByUserId; }

    public String getOfferedByUserName() { return offeredByUserName; }
    public void setOfferedByUserName(String offeredByUserName) { this.offeredByUserName = offeredByUserName; }

    public BigDecimal getOfferedPrice() { return offeredPrice; }
    public void setOfferedPrice(BigDecimal offeredPrice) { this.offeredPrice = offeredPrice; }

    public BigDecimal getOfferedQuantity() { return offeredQuantity; }
    public void setOfferedQuantity(BigDecimal offeredQuantity) { this.offeredQuantity = offeredQuantity; }

    public String getUnitType() { return unitType; }
    public void setUnitType(String unitType) { this.unitType = unitType; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public Integer getEstimatedDeliveryDays() { return estimatedDeliveryDays; }
    public void setEstimatedDeliveryDays(Integer estimatedDeliveryDays) { this.estimatedDeliveryDays = estimatedDeliveryDays; }

    public String getAdditionalTerms() { return additionalTerms; }
    public void setAdditionalTerms(String additionalTerms) { this.additionalTerms = additionalTerms; }

    public OfferStatus getOfferStatus() { return offerStatus; }
    public void setOfferStatus(OfferStatus offerStatus) { this.offerStatus = offerStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
