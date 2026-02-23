package com.intellicargo.core.Controller;

import com.intellicargo.core.DTO.ShipmentDto;
import com.intellicargo.core.Model.ShipmentModel.ShipmentStatus;
import com.intellicargo.core.Service.ShipmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/shipments")
public class ShipmentController {

    private final ShipmentService shipmentService;

    public ShipmentController(ShipmentService shipmentService) {
        this.shipmentService = shipmentService;
    }

    // Create shipment for an order
    @PostMapping("/order/{orderId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ShipmentDto> createShipment(@PathVariable UUID orderId,
                                                      Authentication authentication) {
        ShipmentDto created = shipmentService.createShipment(authentication.getName(), orderId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Get shipment by ID
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ShipmentDto> getShipmentById(@PathVariable UUID id) {
        ShipmentDto shipment = shipmentService.getShipmentById(id);
        return ResponseEntity.ok(shipment);
    }

    // Get shipment by order ID
    @GetMapping("/order/{orderId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ShipmentDto> getShipmentByOrderId(@PathVariable UUID orderId) {
        ShipmentDto shipment = shipmentService.getShipmentByOrderId(orderId);
        return ResponseEntity.ok(shipment);
    }

    // Get shipments by status
    @GetMapping("/status/{status}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ShipmentDto>> getShipmentsByStatus(@PathVariable ShipmentStatus status) {
        List<ShipmentDto> shipments = shipmentService.getShipmentsByStatus(status);
        return ResponseEntity.ok(shipments);
    }

    // Get all shipments for the user's company
    @GetMapping("/my-company")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ShipmentDto>> getMyCompanyShipments(Authentication authentication) {
        List<ShipmentDto> shipments = shipmentService.getMyCompanyShipments(authentication.getName());
        return ResponseEntity.ok(shipments);
    }

    // Update shipment status
    @PatchMapping("/{id}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ShipmentDto> updateShipmentStatus(@PathVariable UUID id,
                                                            @RequestParam ShipmentStatus status,
                                                            Authentication authentication) {
        ShipmentDto updated = shipmentService.updateShipmentStatus(authentication.getName(), id, status);
        return ResponseEntity.ok(updated);
    }
}
