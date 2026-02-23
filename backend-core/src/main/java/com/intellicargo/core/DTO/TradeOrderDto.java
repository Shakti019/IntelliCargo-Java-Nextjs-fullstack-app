package com.intellicargo.core.DTO;

import com.intellicargo.core.Model.TradeOrderModel.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class TradeOrderDto {
    private UUID id;
    private UUID tradeRequestId;
    private UUID acceptedOfferId;
    private Long buyerCompanyId;
    private String buyerCompanyName;
    private Long sellerCompanyId;
    private String sellerCompanyName;
    private BigDecimal finalPrice;
    private BigDecimal finalQuantity;
    private String currency;
    private String incoterm;
    private OrderStatus tradeStatus;
    private String productName;
    private String productCategory;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TradeOrderDto() {}

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getTradeRequestId() { return tradeRequestId; }
    public void setTradeRequestId(UUID tradeRequestId) { this.tradeRequestId = tradeRequestId; }

    public UUID getAcceptedOfferId() { return acceptedOfferId; }
    public void setAcceptedOfferId(UUID acceptedOfferId) { this.acceptedOfferId = acceptedOfferId; }

    public Long getBuyerCompanyId() { return buyerCompanyId; }
    public void setBuyerCompanyId(Long buyerCompanyId) { this.buyerCompanyId = buyerCompanyId; }

    public String getBuyerCompanyName() { return buyerCompanyName; }
    public void setBuyerCompanyName(String buyerCompanyName) { this.buyerCompanyName = buyerCompanyName; }

    public Long getSellerCompanyId() { return sellerCompanyId; }
    public void setSellerCompanyId(Long sellerCompanyId) { this.sellerCompanyId = sellerCompanyId; }

    public String getSellerCompanyName() { return sellerCompanyName; }
    public void setSellerCompanyName(String sellerCompanyName) { this.sellerCompanyName = sellerCompanyName; }

    public BigDecimal getFinalPrice() { return finalPrice; }
    public void setFinalPrice(BigDecimal finalPrice) { this.finalPrice = finalPrice; }

    public BigDecimal getFinalQuantity() { return finalQuantity; }
    public void setFinalQuantity(BigDecimal finalQuantity) { this.finalQuantity = finalQuantity; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getIncoterm() { return incoterm; }
    public void setIncoterm(String incoterm) { this.incoterm = incoterm; }

    public OrderStatus getTradeStatus() { return tradeStatus; }
    public void setTradeStatus(OrderStatus tradeStatus) { this.tradeStatus = tradeStatus; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductCategory() { return productCategory; }
    public void setProductCategory(String productCategory) { this.productCategory = productCategory; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
