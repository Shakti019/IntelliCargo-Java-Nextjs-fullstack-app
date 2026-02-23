package com.intellicargo.core.Model.Geo;

import com.intellicargo.core.Model.UserModel;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "warehouses")
public class WarehouseModel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = false)
    private UserModel user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "geo_node_id", nullable = true)
    private GeoIntelligenceNodeModel geoNode;

    @Column(precision = 19, scale = 4)
    private BigDecimal capacity;

    public WarehouseModel() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UserModel getUser() { return user; }
    public void setUser(UserModel user) { this.user = user; }

    public GeoIntelligenceNodeModel getGeoNode() { return geoNode; }
    public void setGeoNode(GeoIntelligenceNodeModel geoNode) { this.geoNode = geoNode; }

    public BigDecimal getCapacity() { return capacity; }
    public void setCapacity(BigDecimal capacity) { this.capacity = capacity; }
}
