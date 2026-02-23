package com.intellicargo.core.Service;

import com.intellicargo.core.DTO.TradeOfferDto;
import com.intellicargo.core.Model.CompanyModel;
import com.intellicargo.core.Model.TradeOfferModel;
import com.intellicargo.core.Model.TradeOfferModel.OfferStatus;
import com.intellicargo.core.Model.TradeRequestModel;
import com.intellicargo.core.Model.UserCompanyRoleModel;
import com.intellicargo.core.Model.UserModel;
import com.intellicargo.core.Repository.TradeOfferRepository;
import com.intellicargo.core.Repository.TradeRequestRepository;
import com.intellicargo.core.Repository.UserCompanyRoleRepository;
import com.intellicargo.core.Repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class TradeOfferService {

    private final TradeOfferRepository tradeOfferRepository;
    private final TradeRequestRepository tradeRequestRepository;
    private final UserRepository userRepository;
    private final UserCompanyRoleRepository userCompanyRoleRepository;

    public TradeOfferService(TradeOfferRepository tradeOfferRepository,
                            TradeRequestRepository tradeRequestRepository,
                            UserRepository userRepository,
                            UserCompanyRoleRepository userCompanyRoleRepository) {
        this.tradeOfferRepository = tradeOfferRepository;
        this.tradeRequestRepository = tradeRequestRepository;
        this.userRepository = userRepository;
        this.userCompanyRoleRepository = userCompanyRoleRepository;
    }

    // Create a new trade offer
    public TradeOfferDto createOffer(String userEmail, TradeOfferDto dto) {
        UserModel user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserCompanyRoleModel userCompanyRole = userCompanyRoleRepository.findByUserAndIsPrimaryTrue(user)
                .orElseThrow(() -> new RuntimeException("User is not associated with any company"));

        CompanyModel company = userCompanyRole.getCompany();

        TradeRequestModel tradeRequest = tradeRequestRepository.findById(dto.getTradeRequestId())
                .orElseThrow(() -> new RuntimeException("Trade request not found"));

        // Don't allow offering on own trade request
        if (tradeRequest.getCompany().getId().equals(company.getId())) {
            throw new RuntimeException("Cannot make an offer on your own trade request");
        }

        TradeOfferModel offer = new TradeOfferModel();
        offer.setTradeRequest(tradeRequest);
        offer.setOfferedByCompany(company);
        offer.setOfferedByUser(user);
        offer.setOfferedPrice(dto.getOfferedPrice());
        offer.setOfferedQuantity(dto.getOfferedQuantity());
        offer.setCurrency(dto.getCurrency());
        offer.setEstimatedDeliveryDays(dto.getEstimatedDeliveryDays());
        offer.setAdditionalTerms(dto.getAdditionalTerms());
        offer.setOfferStatus(OfferStatus.PENDING);

        TradeOfferModel saved = tradeOfferRepository.save(offer);
        return mapToDto(saved);
    }

    // Get offer by ID
    public TradeOfferDto getOfferById(UUID id) {
        TradeOfferModel offer = tradeOfferRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trade offer not found"));
        return mapToDto(offer);
    }

    // Get all offers for a trade request
    public List<TradeOfferDto> getOffersByTradeRequest(UUID tradeRequestId) {
        TradeRequestModel request = tradeRequestRepository.findById(tradeRequestId)
                .orElseThrow(() -> new RuntimeException("Trade request not found"));

        return tradeOfferRepository.findByTradeRequest(request)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Get all offers made by user's company
    public List<TradeOfferDto> getMyCompanyOffers(String userEmail) {
        UserModel user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserCompanyRoleModel userCompanyRole = userCompanyRoleRepository.findByUserAndIsPrimaryTrue(user)
                .orElseThrow(() -> new RuntimeException("User is not associated with any company"));

        return tradeOfferRepository.findByOfferedByCompany(userCompanyRole.getCompany())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Get offers RECEIVED by user's company (offers on their trade requests)
    public List<TradeOfferDto> getReceivedOffers(String userEmail) {
        UserModel user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserCompanyRoleModel userCompanyRole = userCompanyRoleRepository.findByUserAndIsPrimaryTrue(user)
                .orElseThrow(() -> new RuntimeException("User is not associated with any company"));

        return tradeOfferRepository.findByTradeRequestCompany(userCompanyRole.getCompany())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Get ACCEPTED offers for user's company (for creating orders)
    public List<TradeOfferDto> getAcceptedOffers(String userEmail) {
        UserModel user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserCompanyRoleModel userCompanyRole = userCompanyRoleRepository.findByUserAndIsPrimaryTrue(user)
                .orElseThrow(() -> new RuntimeException("User is not associated with any company"));

        return tradeOfferRepository.findByTradeRequestCompanyAndOfferStatus(
                userCompanyRole.getCompany(), OfferStatus.ACCEPTED)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Update offer status (accept/reject/counter)
    public TradeOfferDto updateOfferStatus(String userEmail, UUID offerId, OfferStatus newStatus) {
        UserModel user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserCompanyRoleModel userCompanyRole = userCompanyRoleRepository.findByUserAndIsPrimaryTrue(user)
                .orElseThrow(() -> new RuntimeException("User is not associated with any company"));

        TradeOfferModel offer = tradeOfferRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Trade offer not found"));

        // Verify user's company owns the trade request (for accepting/rejecting)
        if (!offer.getTradeRequest().getCompany().getId().equals(userCompanyRole.getCompany().getId())) {
            throw new RuntimeException("Only users from the trade request's company can update offer status");
        }

        offer.setOfferStatus(newStatus);
        TradeOfferModel updated = tradeOfferRepository.save(offer);
        return mapToDto(updated);
    }

    // Delete offer (only by creator before it's accepted)
    public void deleteOffer(String userEmail, UUID offerId) {
        UserModel user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        TradeOfferModel offer = tradeOfferRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Trade offer not found"));

        if (offer.getOfferedByUser().getUserId() != user.getUserId()) {
            throw new RuntimeException("You don't have permission to delete this offer");
        }

        if (offer.getOfferStatus() == OfferStatus.ACCEPTED) {
            throw new RuntimeException("Cannot delete an accepted offer");
        }

        tradeOfferRepository.delete(offer);
    }

    // Map entity to DTO
    private TradeOfferDto mapToDto(TradeOfferModel offer) {
        TradeOfferDto dto = new TradeOfferDto();
        dto.setId(offer.getId());
        dto.setTradeRequestId(offer.getTradeRequest().getId());
        dto.setTradeRequestTitle(offer.getTradeRequest().getTitle());
        dto.setTradeRequestCompanyId(offer.getTradeRequest().getCompany().getId());
        dto.setTradeRequestCompanyName(offer.getTradeRequest().getCompany().getName());
        dto.setOfferedByCompanyId(offer.getOfferedByCompany().getId());
        dto.setOfferedByCompanyName(offer.getOfferedByCompany().getName());
        
        // Safely handle offeredByUser relationship
        if (offer.getOfferedByUser() != null) {
            dto.setOfferedByUserId(offer.getOfferedByUser().getUserId());
            dto.setOfferedByUserName(offer.getOfferedByUser().getFullName());
        }
        
        dto.setOfferedPrice(offer.getOfferedPrice());
        dto.setOfferedQuantity(offer.getOfferedQuantity());
        dto.setUnitType(offer.getTradeRequest().getUnitType());
        dto.setCurrency(offer.getCurrency());
        dto.setEstimatedDeliveryDays(offer.getEstimatedDeliveryDays());
        dto.setAdditionalTerms(offer.getAdditionalTerms());
        dto.setOfferStatus(offer.getOfferStatus());
        dto.setCreatedAt(offer.getCreatedAt());
        dto.setUpdatedAt(offer.getUpdatedAt());
        return dto;
    }
}
