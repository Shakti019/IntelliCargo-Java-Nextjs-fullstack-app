package com.intellicargo.core.DTO;

import com.intellicargo.core.Model.ShipmentRouteStageModel.StageStatus;
import com.intellicargo.core.Model.ShipmentRouteStageModel.StageType;
import java.time.LocalDateTime;
import java.util.UUID;

public class ShipmentRouteStageDto {
    private UUID id;
    private UUID shipmentId;
    private Integer stageOrder;
    private String locationName;
    private String locationAddress;
    private Double latitude;
    private Double longitude;
    private StageType stageType;
    private StageStatus stageStatus;
    private LocalDateTime estimatedArrival;
    private LocalDateTime actualArrival;
    private LocalDateTime estimatedDeparture;
    private LocalDateTime actualDeparture;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ShipmentRouteStageDto() {}

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getShipmentId() { return shipmentId; }
    public void setShipmentId(UUID shipmentId) { this.shipmentId = shipmentId; }

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
