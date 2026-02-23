package com.intellicargo.core.Controller;

import com.intellicargo.core.DTO.TradeOrderDto;
import com.intellicargo.core.Model.TradeOrderModel.OrderStatus;
import com.intellicargo.core.Service.TradeOrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/trade-orders")
public class TradeOrderController {

    private final TradeOrderService tradeOrderService;

    public TradeOrderController(TradeOrderService tradeOrderService) {
        this.tradeOrderService = tradeOrderService;
    }

    // Create order by accepting an offer
    @PostMapping("/from-offer/{offerId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TradeOrderDto> createOrderFromOffer(@PathVariable UUID offerId,
                                                              Authentication authentication) {
        TradeOrderDto created = tradeOrderService.createOrderFromOffer(authentication.getName(), offerId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Get order by ID
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TradeOrderDto> getOrderById(@PathVariable UUID id) {
        TradeOrderDto order = tradeOrderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

    // Get all orders for current user's company
    @GetMapping("/my-company")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TradeOrderDto>> getMyCompanyOrders(Authentication authentication) {
        List<TradeOrderDto> orders = tradeOrderService.getMyCompanyOrders(authentication.getName());
        return ResponseEntity.ok(orders);
    }

    // Get purchase orders (where company is buyer)
    @GetMapping("/purchases")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TradeOrderDto>> getMyPurchaseOrders(Authentication authentication) {
        List<TradeOrderDto> orders = tradeOrderService.getMyPurchaseOrders(authentication.getName());
        return ResponseEntity.ok(orders);
    }

    // Get sales orders (where company is seller)
    @GetMapping("/sales")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TradeOrderDto>> getMySalesOrders(Authentication authentication) {
        List<TradeOrderDto> orders = tradeOrderService.getMySalesOrders(authentication.getName());
        return ResponseEntity.ok(orders);
    }

    // Update order status
    @PatchMapping("/{id}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TradeOrderDto> updateOrderStatus(@PathVariable UUID id,
                                                           @RequestParam OrderStatus status,
                                                           Authentication authentication) {
        TradeOrderDto updated = tradeOrderService.updateOrderStatus(authentication.getName(), id, status);
        return ResponseEntity.ok(updated);
    }
}
