package com.intellicargo.core.Repository;

import com.intellicargo.core.Model.ShipmentModel;
import com.intellicargo.core.Model.ShipmentModel.ShipmentStatus;
import com.intellicargo.core.Model.TradeOrderModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

@Repository
public interface ShipmentRepository extends JpaRepository<ShipmentModel, UUID> {
    
    // Find shipment by order
    Optional<ShipmentModel> findByOrder(TradeOrderModel order);
    
    // Find shipments by status
    List<ShipmentModel> findByStatus(ShipmentStatus status);
    
    // Find shipments by order ID
    Optional<ShipmentModel> findByOrderId(UUID orderId);
    
    // Find all active shipments (in transit)
    List<ShipmentModel> findByStatusIn(List<ShipmentStatus> statuses);
}

