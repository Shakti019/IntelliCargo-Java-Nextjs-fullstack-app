package com.intellicargo.core.Model.Geo;

import com.intellicargo.core.Model.ShipmentModel;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "shipment_routes")
public class ShipmentRouteModel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipment_id", nullable = false)
    private ShipmentModel shipment;

    @Column(name = "total_distance", precision = 19, scale = 4)
    private BigDecimal totalDistance;

    @Column(name = "total_cost", precision = 19, scale = 2)
    private BigDecimal totalCost;

    @Column(name = "total_estimated_time", precision = 19, scale = 2)
    private BigDecimal totalEstimatedTime;

    @Column(name = "optimization_score")
    private Double optimizationScore;

    @Column(name = "route_path", columnDefinition = "JSONB")
    private String routePath; // Storing as JSON string. Requires a converter or custom type for true JSONB mapping in simplified setups.

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public ShipmentModel getShipment() { return shipment; }
    public void setShipment(ShipmentModel shipment) { this.shipment = shipment; }

    public BigDecimal getTotalDistance() { return totalDistance; }
    public void setTotalDistance(BigDecimal totalDistance) { this.totalDistance = totalDistance; }

    public BigDecimal getTotalCost() { return totalCost; }
    public void setTotalCost(BigDecimal totalCost) { this.totalCost = totalCost; }

    public BigDecimal getTotalEstimatedTime() { return totalEstimatedTime; }
    public void setTotalEstimatedTime(BigDecimal totalEstimatedTime) { this.totalEstimatedTime = totalEstimatedTime; }

    public Double getOptimizationScore() { return optimizationScore; }
    public void setOptimizationScore(Double optimizationScore) { this.optimizationScore = optimizationScore; }

    public String getRoutePath() { return routePath; }
    public void setRoutePath(String routePath) { this.routePath = routePath; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
