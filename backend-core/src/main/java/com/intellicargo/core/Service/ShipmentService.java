package com.intellicargo.core.Service;

import com.intellicargo.core.DTO.ShipmentDto;
import com.intellicargo.core.DTO.ShipmentRouteStageDto;
import com.intellicargo.core.Model.ShipmentModel;
import com.intellicargo.core.Model.ShipmentModel.ShipmentStatus;
import com.intellicargo.core.Model.ShipmentRouteStageModel;
import com.intellicargo.core.Model.TradeOrderModel;
import com.intellicargo.core.Model.UserCompanyRoleModel;
import com.intellicargo.core.Model.UserModel;
import com.intellicargo.core.Repository.ShipmentRepository;
import com.intellicargo.core.Repository.ShipmentRouteStageRepository;
import com.intellicargo.core.Repository.TradeOrderRepository;
import com.intellicargo.core.Repository.UserCompanyRoleRepository;
import com.intellicargo.core.Repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final ShipmentRouteStageRepository routeStageRepository;
    private final TradeOrderRepository tradeOrderRepository;
    private final UserRepository userRepository;
    private final UserCompanyRoleRepository userCompanyRoleRepository;

    public ShipmentService(ShipmentRepository shipmentRepository,
                          ShipmentRouteStageRepository routeStageRepository,
                          TradeOrderRepository tradeOrderRepository,
                          UserRepository userRepository,
                          UserCompanyRoleRepository userCompanyRoleRepository) {
        this.shipmentRepository = shipmentRepository;
        this.routeStageRepository = routeStageRepository;
        this.tradeOrderRepository = tradeOrderRepository;
        this.userRepository = userRepository;
        this.userCompanyRoleRepository = userCompanyRoleRepository;
    }

    // Create shipment for an order
    public ShipmentDto createShipment(String userEmail, UUID orderId) {
        UserModel user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        TradeOrderModel order = tradeOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Trade order not found"));

        UserCompanyRoleModel userCompanyRole = userCompanyRoleRepository.findByUserAndIsPrimaryTrue(user)
                .orElseThrow(() -> new RuntimeException("User is not associated with any company"));

        // Verify user's company is involved in the order
        Long companyId = userCompanyRole.getCompany().getId();
        if (!order.getBuyerCompany().getId().equals(companyId) && 
            !order.getSellerCompany().getId().equals(companyId)) {
            throw new RuntimeException("You don't have permission to create shipment for this order");
        }

        // Check if shipment already exists
        if (shipmentRepository.findByOrder(order).isPresent()) {
            throw new RuntimeException("Shipment already exists for this order");
        }

        ShipmentModel shipment = new ShipmentModel();
        shipment.setOrder(order);
        shipment.setStatus(ShipmentStatus.PENDING);
        
        // Generate a tracking number
        shipment.setTrackingNumber("SHP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        ShipmentModel saved = shipmentRepository.save(shipment);
        return mapToDto(saved);
    }

    // Get shipment by ID
    public ShipmentDto getShipmentById(UUID id) {
        ShipmentModel shipment = shipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));
        return mapToDto(shipment);
    }

    // Get shipment by order ID
    public ShipmentDto getShipmentByOrderId(UUID orderId) {
        ShipmentModel shipment = shipmentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Shipment not found for this order"));
        return mapToDto(shipment);
    }

    // Get all shipments by status
    public List<ShipmentDto> getShipmentsByStatus(ShipmentStatus status) {
        return shipmentRepository.findByStatus(status)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Get all shipments for the user's company
    public List<ShipmentDto> getMyCompanyShipments(String userEmail) {
        UserModel user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserCompanyRoleModel userCompanyRole = userCompanyRoleRepository.findByUserAndIsPrimaryTrue(user)
                .orElseThrow(() -> new RuntimeException("User is not associated with any company"));

        Long companyId = userCompanyRole.getCompany().getId();

        List<ShipmentModel> shipments = shipmentRepository.findAll();
        return shipments.stream()
                .filter(s -> s.getOrder().getBuyerCompany().getId().equals(companyId) ||
                            s.getOrder().getSellerCompany().getId().equals(companyId))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Update shipment status
    public ShipmentDto updateShipmentStatus(String userEmail, UUID shipmentId, ShipmentStatus newStatus) {
        UserModel user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        ShipmentModel shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));

        UserCompanyRoleModel userCompanyRole = userCompanyRoleRepository.findByUserAndIsPrimaryTrue(user)
                .orElseThrow(() -> new RuntimeException("User is not associated with any company"));

        // Verify user's company is involved
        Long companyId = userCompanyRole.getCompany().getId();
        TradeOrderModel order = shipment.getOrder();
        if (!order.getBuyerCompany().getId().equals(companyId) && 
            !order.getSellerCompany().getId().equals(companyId)) {
            throw new RuntimeException("You don't have permission to update this shipment");
        }

        shipment.setStatus(newStatus);
        ShipmentModel updated = shipmentRepository.save(shipment);
        return mapToDto(updated);
    }

    // Map entity to DTO
    private ShipmentDto mapToDto(ShipmentModel shipment) {
        ShipmentDto dto = new ShipmentDto();
        dto.setId(shipment.getId());
        dto.setOrderId(shipment.getOrder().getId());
        dto.setStatus(shipment.getStatus());
        dto.setTrackingNumber(shipment.getTrackingNumber());
        dto.setCarrier(shipment.getCarrier());
        dto.setEstimatedDelivery(shipment.getEstimatedDelivery());
        dto.setActualDelivery(shipment.getActualDelivery());
        dto.setOriginAddress(shipment.getOriginAddress());
        dto.setDestinationAddress(shipment.getDestinationAddress());
        dto.setNotes(shipment.getNotes());
        
        // Load route stages
        List<ShipmentRouteStageModel> stages = routeStageRepository.findByShipment_IdOrderByStageOrderAsc(shipment.getId());
        List<ShipmentRouteStageDto> stageDtos = stages.stream()
                .map(this::mapRouteStageToDto)
                .collect(Collectors.toList());
        dto.setRouteStages(stageDtos);
        
        dto.setCreatedAt(shipment.getCreatedAt());
        dto.setUpdatedAt(shipment.getUpdatedAt());
        return dto;
    }
    
    private ShipmentRouteStageDto mapRouteStageToDto(ShipmentRouteStageModel stage) {
        ShipmentRouteStageDto dto = new ShipmentRouteStageDto();
        dto.setId(stage.getId());
        dto.setShipmentId(stage.getShipment().getId());
        dto.setStageOrder(stage.getStageOrder());
        dto.setLocationName(stage.getLocationName());
        dto.setLocationAddress(stage.getLocationAddress());
        dto.setLatitude(stage.getLatitude());
        dto.setLongitude(stage.getLongitude());
        dto.setStageType(stage.getStageType());
        dto.setStageStatus(stage.getStageStatus());
        dto.setEstimatedArrival(stage.getEstimatedArrival());
        dto.setActualArrival(stage.getActualArrival());
        dto.setEstimatedDeparture(stage.getEstimatedDeparture());
        dto.setActualDeparture(stage.getActualDeparture());
        dto.setNotes(stage.getNotes());
        dto.setCreatedAt(stage.getCreatedAt());
        dto.setUpdatedAt(stage.getUpdatedAt());
        return dto;
    }
}
