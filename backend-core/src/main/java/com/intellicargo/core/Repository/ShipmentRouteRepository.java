package com.intellicargo.core.Repository;

import com.intellicargo.core.Model.Geo.ShipmentRouteModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;


@Repository
public interface ShipmentRouteRepository extends JpaRepository<ShipmentRouteModel, UUID> {
    // Queries for finding routes by shipment_id can be added if needed,
    // though currently it's a direct reference
}
