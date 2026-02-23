package com.intellicargo.core.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "shipment_route_stages")
public class ShipmentRouteStageModel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipment_id", nullable = false)
    private ShipmentModel shipment;

    @Column(name = "stage_order", nullable = false)
    private Integer stageOrder;

    @Column(name = "location_name", length = 255)
    private String locationName;

    @Column(name = "location_address")
    private String locationAddress;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Enumerated(EnumType.STRING)
    @Column(name = "stage_type", length = 50)
    private StageType stageType;

    @Enumerated(EnumType.STRING)
    @Column(name = "stage_status", length = 50, nullable = false)
    private StageStatus stageStatus;

    @Column(name = "estimated_arrival")
    private LocalDateTime estimatedArrival;

    @Column(name = "actual_arrival")
    private LocalDateTime actualArrival;

    @Column(name = "estimated_departure")
    private LocalDateTime estimatedDeparture;

    @Column(name = "actual_departure")
    private LocalDateTime actualDeparture;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum StageType {
        ORIGIN_WAREHOUSE,
        PORT_OF_LOADING,
        CUSTOMS_EXPORT,
        SEA_TRANSPORT,
        AIR_TRANSPORT,
        ROAD_TRANSPORT,
        RAIL_TRANSPORT,
        CUSTOMS_IMPORT,
        PORT_OF_DISCHARGE,
        DISTRIBUTION_CENTER,
        DESTINATION_WAREHOUSE,
        FINAL_DELIVERY
    }

    public enum StageStatus {
        PENDING,
        IN_PROGRESS,
        COMPLETED,
        DELAYED,
        CANCELLED
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (stageStatus == null) {
            stageStatus = StageStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public ShipmentRouteStageModel() {}

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public ShipmentModel getShipment() { return shipment; }
    public void setShipment(ShipmentModel shipment) { this.shipment = shipment; }

    public Integer getStageOrder() { return stageOrder; }
    public void setStageOrder(Integer stageOrder) { this.stageOrder = stageOrder; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public String getLocationAddress() { return locationAddress; }
    public void setLocationAddress(String locationAddress) { this.locationAddress = locationAddress; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public StageType getStageType() { return stageType; }
    public void setStageType(StageType stageType) { this.stageType = stageType; }

    public StageStatus getStageStatus() { return stageStatus; }
    public void setStageStatus(StageStatus stageStatus) { this.stageStatus = stageStatus; }

    public LocalDateTime getEstimatedArrival() { return estimatedArrival; }
    public void setEstimatedArrival(LocalDateTime estimatedArrival) { this.estimatedArrival = estimatedArrival; }

    public LocalDateTime getActualArrival() { return actualArrival; }
    public void setActualArrival(LocalDateTime actualArrival) { this.actualArrival = actualArrival; }

    public LocalDateTime getEstimatedDeparture() { return estimatedDeparture; }
    public void setEstimatedDeparture(LocalDateTime estimatedDeparture) { this.estimatedDeparture = estimatedDeparture; }

    public LocalDateTime getActualDeparture() { return actualDeparture; }
    public void setActualDeparture(LocalDateTime actualDeparture) { this.actualDeparture = actualDeparture; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
