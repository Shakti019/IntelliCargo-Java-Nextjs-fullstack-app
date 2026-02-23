package com.intellicargo.core.Model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "trade_requests")
public class TradeRequestModel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id;

    // created_by INT REFERENCES users(user_id)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", referencedColumnName = "user_id", nullable = false)
    private UserModel createdBy;

    // company_id UUID REFERENCES companies(id)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private CompanyModel company;

    // product_id UUID REFERENCES products(id)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private ProductModel product;

    @Enumerated(EnumType.STRING)
    @Column(name = "trade_type", length = 50, nullable = false)
    private TradeType tradeType;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(precision = 19, scale = 4)
    private BigDecimal quantity;

    @Column(name = "unit_type", length = 50)
    private String unitType;

    @Column(name = "budget_min", precision = 19, scale = 2)
    private BigDecimal budgetMin;

    @Column(name = "budget_max", precision = 19, scale = 2)
    private BigDecimal budgetMax;

    @Column(length = 10)
    private String currency;

    @Column(name = "origin_country", length = 100)
    private String originCountry;

    @Column(name = "destination_country", length = 100)
    private String destinationCountry;

    @Column(name = "preferred_incoterm", length = 50)
    private String preferredIncoterm;

    @Enumerated(EnumType.STRING)
    @Column(name = "trade_status", length = 50, nullable = false)
    private TradeStatus tradeStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibility", length = 50, nullable = false)
    private Visibility visibility;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Enums based on schema comments
    public enum TradeType {
        BUY_PRODUCT, SELL_PRODUCT, TRANSPORT_SERVICE, WAREHOUSE_SERVICE, CUSTOM_SERVICE
    }

    public enum TradeStatus {
        OPEN, NEGOTIATION, CONFIRMED, CANCELLED, EXPIRED
    }

    public enum Visibility {
        GLOBAL, PRIVATE, COMPANY_ONLY
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (tradeStatus == null) {
            tradeStatus = TradeStatus.OPEN;
        }
        if (visibility == null) {
            visibility = Visibility.GLOBAL;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors
    public TradeRequestModel() {}

    // Getters and Setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UserModel getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UserModel createdBy) {
        this.createdBy = createdBy;
    }

    public CompanyModel getCompany() {
        return company;
    }

    public void setCompany(CompanyModel company) {
        this.company = company;
    }

    public ProductModel getProduct() {
        return product;
    }

    public void setProduct(ProductModel product) {
        this.product = product;
    }

    public TradeType getTradeType() {
        return tradeType;
    }

    public void setTradeType(TradeType tradeType) {
        this.tradeType = tradeType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public String getUnitType() {
        return unitType;
    }

    public void setUnitType(String unitType) {
        this.unitType = unitType;
    }

    public BigDecimal getBudgetMin() {
        return budgetMin;
    }

    public void setBudgetMin(BigDecimal budgetMin) {
        this.budgetMin = budgetMin;
    }

    public BigDecimal getBudgetMax() {
        return budgetMax;
    }

    public void setBudgetMax(BigDecimal budgetMax) {
        this.budgetMax = budgetMax;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getOriginCountry() {
        return originCountry;
    }

    public void setOriginCountry(String originCountry) {
        this.originCountry = originCountry;
    }

    public String getDestinationCountry() {
        return destinationCountry;
    }

    public void setDestinationCountry(String destinationCountry) {
        this.destinationCountry = destinationCountry;
    }

    public String getPreferredIncoterm() {
        return preferredIncoterm;
    }

    public void setPreferredIncoterm(String preferredIncoterm) {
        this.preferredIncoterm = preferredIncoterm;
    }

    public TradeStatus getTradeStatus() {
        return tradeStatus;
    }

    public void setTradeStatus(TradeStatus tradeStatus) {
        this.tradeStatus = tradeStatus;
    }

    public Visibility getVisibility() {
        return visibility;
    }

    public void setVisibility(Visibility visibility) {
        this.visibility = visibility;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
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