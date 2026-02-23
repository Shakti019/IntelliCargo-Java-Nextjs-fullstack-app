package com.intellicargo.core.Controller;

import com.intellicargo.core.DTO.TradeOfferDto;
import com.intellicargo.core.Model.TradeOfferModel.OfferStatus;
import com.intellicargo.core.Service.TradeOfferService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/trade-offers")
public class TradeOfferController {

    private final TradeOfferService tradeOfferService;

    public TradeOfferController(TradeOfferService tradeOfferService) {
        this.tradeOfferService = tradeOfferService;
    }

    // Create a new trade offer
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TradeOfferDto> createOffer(@RequestBody TradeOfferDto dto,
                                                     Authentication authentication) {
        TradeOfferDto created = tradeOfferService.createOffer(authentication.getName(), dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Get offer by ID
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TradeOfferDto> getOfferById(@PathVariable UUID id) {
        TradeOfferDto offer = tradeOfferService.getOfferById(id);
        return ResponseEntity.ok(offer);
    }

    // Get all offers for a trade request
    @GetMapping("/trade-request/{tradeRequestId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TradeOfferDto>> getOffersByTradeRequest(@PathVariable UUID tradeRequestId) {
        List<TradeOfferDto> offers = tradeOfferService.getOffersByTradeRequest(tradeRequestId);
        return ResponseEntity.ok(offers);
    }

    // Get all offers made by current user's company
    @GetMapping("/my-company")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TradeOfferDto>> getMyCompanyOffers(Authentication authentication) {
        List<TradeOfferDto> offers = tradeOfferService.getMyCompanyOffers(authentication.getName());
        return ResponseEntity.ok(offers);
    }

    // Get offers RECEIVED by current user's company (on their trade requests)
    @GetMapping("/received")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TradeOfferDto>> getReceivedOffers(Authentication authentication) {
        List<TradeOfferDto> offers = tradeOfferService.getReceivedOffers(authentication.getName());
        return ResponseEntity.ok(offers);
    }

    // Get ACCEPTED offers for creating orders
    @GetMapping("/accepted")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TradeOfferDto>> getAcceptedOffers(Authentication authentication) {
        List<TradeOfferDto> offers = tradeOfferService.getAcceptedOffers(authentication.getName());
        return ResponseEntity.ok(offers);
    }

    // Update offer status (accept/reject)
    @PatchMapping("/{id}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TradeOfferDto> updateOfferStatus(@PathVariable UUID id,
                                                           @RequestParam OfferStatus status,
                                                           Authentication authentication) {
        TradeOfferDto updated = tradeOfferService.updateOfferStatus(authentication.getName(), id, status);
        return ResponseEntity.ok(updated);
    }

    // Delete offer
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteOffer(@PathVariable UUID id, Authentication authentication) {
        tradeOfferService.deleteOffer(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
