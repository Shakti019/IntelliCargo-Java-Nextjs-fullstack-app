package com.intellicargo.core.Model.Geo;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "transport_edges")
public class TransportEdgeModel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_node_id", nullable = false)
    private TransportNodeModel fromNode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_node_id", nullable = false)
    private TransportNodeModel toNode;

    @Column(name = "distance_km", precision = 19, scale = 4)
    private BigDecimal distanceKm;

    @Column(name = "base_cost", precision = 19, scale = 2)
    private BigDecimal baseCost;

    @Column(name = "avg_time_hours", precision = 19, scale = 2)
    private BigDecimal avgTimeHours;

    @Enumerated(EnumType.STRING)
    @Column(name = "transport_mode", length = 50)
    private TransportMode transportMode;

    public enum TransportMode {
        SEA, AIR, ROAD, RAIL
    }

    public TransportEdgeModel() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public TransportNodeModel getFromNode() { return fromNode; }
    public void setFromNode(TransportNodeModel fromNode) { this.fromNode = fromNode; }

    public TransportNodeModel getToNode() { return toNode; }
    public void setToNode(TransportNodeModel toNode) { this.toNode = toNode; }

    public BigDecimal getDistanceKm() { return distanceKm; }
    public void setDistanceKm(BigDecimal distanceKm) { this.distanceKm = distanceKm; }

    public BigDecimal getBaseCost() { return baseCost; }
    public void setBaseCost(BigDecimal baseCost) { this.baseCost = baseCost; }

    public BigDecimal getAvgTimeHours() { return avgTimeHours; }
    public void setAvgTimeHours(BigDecimal avgTimeHours) { this.avgTimeHours = avgTimeHours; }

    public TransportMode getTransportMode() { return transportMode; }
    public void setTransportMode(TransportMode transportMode) { this.transportMode = transportMode; }
}
