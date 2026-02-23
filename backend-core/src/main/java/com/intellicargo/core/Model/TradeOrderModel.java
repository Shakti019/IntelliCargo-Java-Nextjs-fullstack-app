package com.intellicargo.core.Model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "trade_orders")
public class TradeOrderModel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id;

    // trade_request_id UUID REFERENCES trade_requests(id)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trade_request_id", nullable = false)
    private TradeRequestModel tradeRequest;

    // accepted_offer_id UUID REFERENCES trade_offers(id)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accepted_offer_id", nullable = false)
    private TradeOfferModel acceptedOffer;

    // buyer_company_id UUID REFERENCES companies(id)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_company_id", nullable = false)
    private CompanyModel buyerCompany;

    // seller_company_id UUID REFERENCES companies(id)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_company_id", nullable = false)
    private CompanyModel sellerCompany;

    @Column(name = "final_price", precision = 19, scale = 2)
    private BigDecimal finalPrice;

    @Column(name = "final_quantity", precision = 19, scale = 4)
    private BigDecimal finalQuantity;

    @Column(length = 10)
    private String currency;

    @Column(name = "incoterm", length = 50)
    private String incoterm;

    @Enumerated(EnumType.STRING)
    @Column(name = "trade_status", length = 50, nullable = false)
    private OrderStatus tradeStatus;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum OrderStatus {
        CONTRACTED, IN_PROGRESS, COMPLETED, CANCELLED
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (tradeStatus == null) {
            tradeStatus = OrderStatus.CONTRACTED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors
    public TradeOrderModel() {}

    // Getters and Setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public TradeRequestModel getTradeRequest() {
        return tradeRequest;
    }

    public void setTradeRequest(TradeRequestModel tradeRequest) {
        this.tradeRequest = tradeRequest;
    }

    public TradeOfferModel getAcceptedOffer() {
        return acceptedOffer;
    }

    public void setAcceptedOffer(TradeOfferModel acceptedOffer) {
        this.acceptedOffer = acceptedOffer;
    }

    public CompanyModel getBuyerCompany() {
        return buyerCompany;
    }

    public void setBuyerCompany(CompanyModel buyerCompany) {
        this.buyerCompany = buyerCompany;
    }

    public CompanyModel getSellerCompany() {
        return sellerCompany;
    }

    public void setSellerCompany(CompanyModel sellerCompany) {
        this.sellerCompany = sellerCompany;
    }

    public BigDecimal getFinalPrice() {
        return finalPrice;
    }

    public void setFinalPrice(BigDecimal finalPrice) {
        this.finalPrice = finalPrice;
    }

    public BigDecimal getFinalQuantity() {
        return finalQuantity;
    }

    public void setFinalQuantity(BigDecimal finalQuantity) {
        this.finalQuantity = finalQuantity;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getIncoterm() {
        return incoterm;
    }

    public void setIncoterm(String incoterm) {
        this.incoterm = incoterm;
    }

    public OrderStatus getTradeStatus() {
        return tradeStatus;
    }

    public void setTradeStatus(OrderStatus tradeStatus) {
        this.tradeStatus = tradeStatus;
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
