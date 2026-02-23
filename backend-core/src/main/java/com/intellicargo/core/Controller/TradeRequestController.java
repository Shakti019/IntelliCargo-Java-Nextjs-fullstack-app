package com.intellicargo.core.Controller;

import com.intellicargo.core.DTO.TradeRequestDto;
import com.intellicargo.core.Model.TradeRequestModel.TradeStatus;
import com.intellicargo.core.Model.TradeRequestModel.TradeType;
import com.intellicargo.core.Model.TradeRequestModel.Visibility;
import com.intellicargo.core.Service.TradeRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/trade-requests")
public class TradeRequestController {

    private final TradeRequestService tradeRequestService;

    public TradeRequestController(TradeRequestService tradeRequestService) {
        this.tradeRequestService = tradeRequestService;
    }

    // Create a new trade request
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TradeRequestDto> createTradeRequest(@RequestBody TradeRequestDto dto,
                                                              Authentication authentication) {
        TradeRequestDto created = tradeRequestService.createTradeRequest(authentication.getName(), dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Get trade request by ID
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TradeRequestDto> getTradeRequestById(@PathVariable UUID id) {
        TradeRequestDto request = tradeRequestService.getTradeRequestById(id);
        return ResponseEntity.ok(request);
    }

    // Get all trade requests for current user's company
    @GetMapping("/my-company")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TradeRequestDto>> getMyCompanyTradeRequests(Authentication authentication) {
        List<TradeRequestDto> requests = tradeRequestService.getMyCompanyTradeRequests(authentication.getName());
        return ResponseEntity.ok(requests);
    }

    // Get marketplace trade requests (global, open)
    @GetMapping("/marketplace")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TradeRequestDto>> getMarketplaceTradeRequests(Authentication authentication) {
        List<TradeRequestDto> requests = tradeRequestService.getMarketplaceTradeRequests(authentication.getName());
        return ResponseEntity.ok(requests);
    }

    // Get trade requests by type
    @GetMapping("/type/{type}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TradeRequestDto>> getTradeRequestsByType(@PathVariable TradeType type) {
        List<TradeRequestDto> requests = tradeRequestService.getTradeRequestsByType(type);
        return ResponseEntity.ok(requests);
    }

    // Search trade requests with filters
    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TradeRequestDto>> searchTradeRequests(
            @RequestParam(required = false) Long companyId,
            @RequestParam(required = false) TradeType tradeType,
            @RequestParam(required = false) TradeStatus tradeStatus,
            @RequestParam(required = false) Visibility visibility) {
        List<TradeRequestDto> requests = tradeRequestService.searchTradeRequests(companyId, tradeType, tradeStatus, visibility);
        return ResponseEntity.ok(requests);
    }

    // Update trade request
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TradeRequestDto> updateTradeRequest(@PathVariable UUID id,
                                                              @RequestBody TradeRequestDto dto,
                                                              Authentication authentication) {
        TradeRequestDto updated = tradeRequestService.updateTradeRequest(authentication.getName(), id, dto);
        return ResponseEntity.ok(updated);
    }

    // Cancel trade request
    @PatchMapping("/{id}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> cancelTradeRequest(@PathVariable UUID id, Authentication authentication) {
        tradeRequestService.cancelTradeRequest(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }

    // Delete trade request
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteTradeRequest(@PathVariable UUID id, Authentication authentication) {
        tradeRequestService.deleteTradeRequest(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
