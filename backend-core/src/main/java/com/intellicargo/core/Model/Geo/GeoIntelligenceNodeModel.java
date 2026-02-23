package com.intellicargo.core.Model.Geo;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

// If using pgvector-java, you might use com.pgvector.PGvector;
// For simplicity and compatibility, we map it as a generic Object or specific type if library is present.
// We will use a custom definition.

@Entity
@Table(name = "geo_intelligence_nodes")
public class GeoIntelligenceNodeModel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    // PostGIS Point type - TEMPORARILY DISABLED
    // Requires PostGIS extension: CREATE EXTENSION postgis;
    // @Column(columnDefinition = "geography(Point,4326)")
    // private Point location; // Requires hibernate-spatial

    @Column(name = "weather_index")
    private Double weatherIndex;

    @Column(name = "traffic_index")
    private Double trafficIndex;

    @Column(name = "congestion_probability")
    private Double congestionProbability;

    @Column(name = "fuel_cost_index")
    private Double fuelCostIndex;

    @Column(name = "risk_index")
    private Double riskIndex;

    // pgvector column - TEMPORARILY DISABLED
    // Requires pgvector extension: CREATE EXTENSION vector;
    // @Column(name = "feature_vector", columnDefinition = "vector(8)")
    // private String featureVector; // Storing as string representation or using a custom converter is common if specific type isn't set up

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors, Getters, Setters
    public GeoIntelligenceNodeModel() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    // public Point getLocation() { return location; }
    // public void setLocation(Point location) { this.location = location; }

    public Double getWeatherIndex() { return weatherIndex; }
    public void setWeatherIndex(Double weatherIndex) { this.weatherIndex = weatherIndex; }

    public Double getTrafficIndex() { return trafficIndex; }
    public void setTrafficIndex(Double trafficIndex) { this.trafficIndex = trafficIndex; }

    public Double getCongestionProbability() { return congestionProbability; }
    public void setCongestionProbability(Double congestionProbability) { this.congestionProbability = congestionProbability; }

    public Double getFuelCostIndex() { return fuelCostIndex; }
    public void setFuelCostIndex(Double fuelCostIndex) { this.fuelCostIndex = fuelCostIndex; }

    public Double getRiskIndex() { return riskIndex; }
    public void setRiskIndex(Double riskIndex) { this.riskIndex = riskIndex; }

    // public String getFeatureVector() { return featureVector; }
    // public void setFeatureVector(String featureVector) { this.featureVector = featureVector; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
