package com.intellicargo.core.Service;

import com.intellicargo.core.DTO.TradeOrderDto;
import com.intellicargo.core.Model.CompanyModel;
import com.intellicargo.core.Model.TradeOfferModel;
import com.intellicargo.core.Model.TradeOrderModel;
import com.intellicargo.core.Model.TradeOrderModel.OrderStatus;
import com.intellicargo.core.Model.TradeRequestModel;
import com.intellicargo.core.Model.UserCompanyRoleModel;
import com.intellicargo.core.Model.UserModel;
import com.intellicargo.core.Repository.TradeOfferRepository;
import com.intellicargo.core.Repository.TradeOrderRepository;
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
public class TradeOrderService {

    private final TradeOrderRepository tradeOrderRepository;
    private final TradeOfferRepository tradeOfferRepository;
    private final TradeRequestRepository tradeRequestRepository;
    private final UserRepository userRepository;
    private final UserCompanyRoleRepository userCompanyRoleRepository;

    public TradeOrderService(TradeOrderRepository tradeOrderRepository,
                            TradeOfferRepository tradeOfferRepository,
                            TradeRequestRepository tradeRequestRepository,
                            UserRepository userRepository,
                            UserCompanyRoleRepository userCompanyRoleRepository) {
        this.tradeOrderRepository = tradeOrderRepository;
        this.tradeOfferRepository = tradeOfferRepository;
        this.tradeRequestRepository = tradeRequestRepository;
        this.userRepository = userRepository;
        this.userCompanyRoleRepository = userCompanyRoleRepository;
    }

    // Create order by accepting an offer
    public TradeOrderDto createOrderFromOffer(String userEmail, UUID offerId) {
        UserModel user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        TradeOfferModel offer = tradeOfferRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Trade offer not found"));

        TradeRequestModel request = offer.getTradeRequest();

        // Verify user owns the trade request
        if (request.getCreatedBy().getUserId() != user.getUserId()) {
            throw new RuntimeException("Only the trade request creator can accept offers");
        }

        // Create order
        TradeOrderModel order = new TradeOrderModel();
        order.setTradeRequest(request);
        order.setAcceptedOffer(offer);
        
        // Determine buyer/seller based on trade type
        if (request.getTradeType().toString().contains("BUY")) {
            order.setBuyerCompany(request.getCompany());
            order.setSellerCompany(offer.getOfferedByCompany());
        } else {
            order.setSellerCompany(request.getCompany());
            order.setBuyerCompany(offer.getOfferedByCompany());
        }

        order.setFinalPrice(offer.getOfferedPrice());
        order.setFinalQuantity(offer.getOfferedQuantity());
        order.setCurrency(offer.getCurrency());
        order.setIncoterm(request.getPreferredIncoterm());
        order.setTradeStatus(OrderStatus.CONTRACTED);

        // Update offer status
        offer.setOfferStatus(TradeOfferModel.OfferStatus.ACCEPTED);
        tradeOfferRepository.save(offer);

        // Update request status
        request.setTradeStatus(TradeRequestModel.TradeStatus.CONFIRMED);
        tradeRequestRepository.save(request);

        TradeOrderModel saved = tradeOrderRepository.save(order);
        return mapToDto(saved);
    }

    // Get order by ID
    public TradeOrderDto getOrderById(UUID id) {
        TradeOrderModel order = tradeOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trade order not found"));
        return mapToDto(order);
    }

    // Get all orders for user's company
    public List<TradeOrderDto> getMyCompanyOrders(String userEmail) {
        UserModel user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserCompanyRoleModel userCompanyRole = userCompanyRoleRepository.findByUserAndIsPrimaryTrue(user)
                .orElseThrow(() -> new RuntimeException("User is not associated with any company"));

        return tradeOrderRepository.findAllOrdersForCompany(userCompanyRole.getCompany().getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Get orders where company is buyer
    public List<TradeOrderDto> getMyPurchaseOrders(String userEmail) {
        UserModel user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserCompanyRoleModel userCompanyRole = userCompanyRoleRepository.findByUserAndIsPrimaryTrue(user)
                .orElseThrow(() -> new RuntimeException("User is not associated with any company"));

        return tradeOrderRepository.findByBuyerCompany(userCompanyRole.getCompany())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Get orders where company is seller
    public List<TradeOrderDto> getMySalesOrders(String userEmail) {
        UserModel user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserCompanyRoleModel userCompanyRole = userCompanyRoleRepository.findByUserAndIsPrimaryTrue(user)
                .orElseThrow(() -> new RuntimeException("User is not associated with any company"));

        return tradeOrderRepository.findBySellerCompany(userCompanyRole.getCompany())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Update order status
    public TradeOrderDto updateOrderStatus(String userEmail, UUID orderId, OrderStatus newStatus) {
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
            throw new RuntimeException("You don't have permission to update this order");
        }

        order.setTradeStatus(newStatus);
        TradeOrderModel updated = tradeOrderRepository.save(order);
        return mapToDto(updated);
    }

    // Map entity to DTO
    private TradeOrderDto mapToDto(TradeOrderModel order) {
        TradeOrderDto dto = new TradeOrderDto();
        dto.setId(order.getId());
        dto.setTradeRequestId(order.getTradeRequest().getId());
        dto.setAcceptedOfferId(order.getAcceptedOffer().getId());
        dto.setBuyerCompanyId(order.getBuyerCompany().getId());
        dto.setBuyerCompanyName(order.getBuyerCompany().getName());
        dto.setSellerCompanyId(order.getSellerCompany().getId());
        dto.setSellerCompanyName(order.getSellerCompany().getName());
        dto.setFinalPrice(order.getFinalPrice());
        dto.setFinalQuantity(order.getFinalQuantity());
        dto.setCurrency(order.getCurrency());
        dto.setIncoterm(order.getIncoterm());
        dto.setTradeStatus(order.getTradeStatus());
        
        // Add product information from trade request
        if (order.getTradeRequest() != null && order.getTradeRequest().getProduct() != null) {
            dto.setProductName(order.getTradeRequest().getProduct().getName());
            dto.setProductCategory(order.getTradeRequest().getProduct().getCategory());
        }
        
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        return dto;
    }
}
