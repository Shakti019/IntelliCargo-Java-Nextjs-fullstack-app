package com.intellicargo.core.Model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "trade_additional_details")
public class TradeAdditionalDetailsModel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id;

    // trade_request_id UUID REFERENCES trade_requests(id)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trade_request_id", nullable = false, unique = true)
    private TradeRequestModel tradeRequest;

    @Enumerated(EnumType.STRING)
    @Column(name = "service_type", length = 50)
    private ServiceType serviceType;

    @Column(name = "cargo_weight", precision = 19, scale = 4)
    private BigDecimal cargoWeight;

    @Column(name = "cargo_volume", precision = 19, scale = 4)
    private BigDecimal cargoVolume;

    @Column(name = "container_type", length = 50)
    private String containerType;

    @Column(name = "special_requirements", columnDefinition = "TEXT")
    private String specialRequirements;

    public enum ServiceType {
        SEA, AIR, ROAD, WAREHOUSE
    }

    // Constructors
    public TradeAdditionalDetailsModel() {}

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

    public ServiceType getServiceType() {
        return serviceType;
    }

    public void setServiceType(ServiceType serviceType) {
        this.serviceType = serviceType;
    }

    public BigDecimal getCargoWeight() {
        return cargoWeight;
    }

    public void setCargoWeight(BigDecimal cargoWeight) {
        this.cargoWeight = cargoWeight;
    }

    public BigDecimal getCargoVolume() {
        return cargoVolume;
    }

    public void setCargoVolume(BigDecimal cargoVolume) {
        this.cargoVolume = cargoVolume;
    }

    public String getContainerType() {
        return containerType;
    }

    public void setContainerType(String containerType) {
        this.containerType = containerType;
    }

    public String getSpecialRequirements() {
        return specialRequirements;
    }

    public void setSpecialRequirements(String specialRequirements) {
        this.specialRequirements = specialRequirements;
    }
}
