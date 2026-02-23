package com.intellicargo.core.Model.Geo;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "transport_nodes")
public class TransportNodeModel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private NodeType type; // PORT, CITY, HUB, WAREHOUSE

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "geo_node_id", nullable = true)
    private GeoIntelligenceNodeModel geoNode;

    public enum NodeType {
        PORT, CITY, HUB, WAREHOUSE
    }

    public TransportNodeModel() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public NodeType getType() { return type; }
    public void setType(NodeType type) { this.type = type; }

    public GeoIntelligenceNodeModel getGeoNode() { return geoNode; }
    public void setGeoNode(GeoIntelligenceNodeModel geoNode) { this.geoNode = geoNode; }
}
