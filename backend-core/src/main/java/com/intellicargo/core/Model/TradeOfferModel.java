package com.intellicargo.core.Model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "trade_offers")
public class TradeOfferModel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id;

    // trade_request_id UUID REFERENCES trade_requests(id)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trade_request_id", nullable = false)
    private TradeRequestModel tradeRequest;

    // offered_by_company UUID REFERENCES companies(id)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offered_by_company", nullable = false)
    private CompanyModel offeredByCompany;

    // offered_by_user INT REFERENCES users(user_id)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offered_by_user", referencedColumnName = "user_id", nullable = false)
    private UserModel offeredByUser;

    @Column(name = "offered_price", precision = 19, scale = 2)
    private BigDecimal offeredPrice;

    @Column(name = "offered_quantity", precision = 19, scale = 4)
    private BigDecimal offeredQuantity;

    @Column(length = 10)
    private String currency;

    @Column(name = "estimated_delivery_days")
    private Integer estimatedDeliveryDays;

    @Column(name = "additional_terms", columnDefinition = "TEXT")
    private String additionalTerms;

    @Enumerated(EnumType.STRING)
    @Column(name = "offer_status", length = 50, nullable = false)
    private OfferStatus offerStatus;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum OfferStatus {
        PENDING, ACCEPTED, REJECTED, COUNTERED
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (offerStatus == null) {
            offerStatus = OfferStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors
    public TradeOfferModel() {}

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

    public CompanyModel getOfferedByCompany() {
        return offeredByCompany;
    }

    public void setOfferedByCompany(CompanyModel offeredByCompany) {
        this.offeredByCompany = offeredByCompany;
    }

    public UserModel getOfferedByUser() {
        return offeredByUser;
    }

    public void setOfferedByUser(UserModel offeredByUser) {
        this.offeredByUser = offeredByUser;
    }

    public BigDecimal getOfferedPrice() {
        return offeredPrice;
    }

    public void setOfferedPrice(BigDecimal offeredPrice) {
        this.offeredPrice = offeredPrice;
    }

    public BigDecimal getOfferedQuantity() {
        return offeredQuantity;
    }

    public void setOfferedQuantity(BigDecimal offeredQuantity) {
        this.offeredQuantity = offeredQuantity;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Integer getEstimatedDeliveryDays() {
        return estimatedDeliveryDays;
    }

    public void setEstimatedDeliveryDays(Integer estimatedDeliveryDays) {
        this.estimatedDeliveryDays = estimatedDeliveryDays;
    }

    public String getAdditionalTerms() {
        return additionalTerms;
    }

    public void setAdditionalTerms(String additionalTerms) {
        this.additionalTerms = additionalTerms;
    }

    public OfferStatus getOfferStatus() {
        return offerStatus;
    }

    public void setOfferStatus(OfferStatus offerStatus) {
        this.offerStatus = offerStatus;
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