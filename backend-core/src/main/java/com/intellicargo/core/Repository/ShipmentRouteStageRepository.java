package com.intellicargo.core.Repository;

import com.intellicargo.core.Model.ShipmentRouteStageModel;
import com.intellicargo.core.Model.ShipmentModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ShipmentRouteStageRepository extends JpaRepository<ShipmentRouteStageModel, UUID> {
    
    List<ShipmentRouteStageModel> findByShipmentOrderByStageOrderAsc(ShipmentModel shipment);
    
    List<ShipmentRouteStageModel> findByShipment_IdOrderByStageOrderAsc(UUID shipmentId);
}
