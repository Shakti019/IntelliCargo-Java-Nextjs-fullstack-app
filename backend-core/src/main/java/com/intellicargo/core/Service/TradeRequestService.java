package com.intellicargo.core.Service;

import com.intellicargo.core.DTO.TradeRequestDto;
import com.intellicargo.core.Model.CompanyModel;
import com.intellicargo.core.Model.ProductModel;
import com.intellicargo.core.Model.TradeRequestModel;
import com.intellicargo.core.Model.TradeRequestModel.TradeStatus;
import com.intellicargo.core.Model.TradeRequestModel.TradeType;
import com.intellicargo.core.Model.TradeRequestModel.Visibility;
import com.intellicargo.core.Model.UserCompanyRoleModel;
import com.intellicargo.core.Model.UserModel;
import com.intellicargo.core.Repository.CompanyRepository;
import com.intellicargo.core.Repository.ProductRepository;
import com.intellicargo.core.Repository.TradeRequestRepository;
import com.intellicargo.core.Repository.UserCompanyRoleRepository;
import com.intellicargo.core.Repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class TradeRequestService {

    private final TradeRequestRepository tradeRequestRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final UserCompanyRoleRepository userCompanyRoleRepository;
    private final ProductRepository productRepository;

    public TradeRequestService(TradeRequestRepository tradeRequestRepository,
                              CompanyRepository companyRepository,
                              UserRepository userRepository,
                              UserCompanyRoleRepository userCompanyRoleRepository,
                              ProductRepository productRepository) {
        this.tradeRequestRepository = tradeRequestRepository;
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
        this.userCompanyRoleRepository = userCompanyRoleRepository;
        this.productRepository = productRepository;
    }

    // Create a new trade request
    public TradeRequestDto createTradeRequest(String userEmail, TradeRequestDto dto) {
        UserModel user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserCompanyRoleModel userCompanyRole = userCompanyRoleRepository.findByUserAndIsPrimaryTrue(user)
                .orElseThrow(() -> new RuntimeException("User is not associated with any company"));

        CompanyModel company = userCompanyRole.getCompany();

        TradeRequestModel request = new TradeRequestModel();
        request.setCreatedBy(user);
        request.setCompany(company);
        
        // Set product if productId is provided
        if (dto.getProductId() != null) {
            ProductModel product = productRepository.findById(dto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            request.setProduct(product);
        }
        
        if (dto.getTradeType() == null) {
            throw new RuntimeException("tradeType is required (e.g. BUY_PRODUCT, SELL_PRODUCT)");
        }
        request.setTradeType(dto.getTradeType());
        request.setTitle(dto.getTitle());
        request.setDescription(dto.getDescription());
        request.setQuantity(dto.getQuantity());
        request.setUnitType(dto.getUnitType());
        request.setBudgetMin(dto.getBudgetMin());
        request.setBudgetMax(dto.getBudgetMax());
        request.setCurrency(dto.getCurrency());
        request.setOriginCountry(dto.getOriginCountry());
        request.setDestinationCountry(dto.getDestinationCountry());
        request.setPreferredIncoterm(dto.getPreferredIncoterm());
        request.setTradeStatus(dto.getTradeStatus() != null ? dto.getTradeStatus() : TradeStatus.OPEN);
        request.setVisibility(dto.getVisibility() != null ? dto.getVisibility() : Visibility.GLOBAL);
        request.setExpiresAt(dto.getExpiresAt());

        TradeRequestModel saved = tradeRequestRepository.save(request);
        return mapToDto(saved);
    }

    // Get trade request by ID
    public TradeRequestDto getTradeRequestById(UUID id) {
        TradeRequestModel request = tradeRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trade request not found"));
        return mapToDto(request);
    }

    // Get all trade requests for user's company
    public List<TradeRequestDto> getMyCompanyTradeRequests(String userEmail) {
        UserModel user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserCompanyRoleModel userCompanyRole = userCompanyRoleRepository.findByUserAndIsPrimaryTrue(user)
                .orElseThrow(() -> new RuntimeException("User is not associated with any company"));

        return tradeRequestRepository.findByCompany(userCompanyRole.getCompany())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Get marketplace trade requests (global, open, not expired, excluding user's own company)
    public List<TradeRequestDto> getMarketplaceTradeRequests(String userEmail) {
        UserModel user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserCompanyRoleModel userCompanyRole = userCompanyRoleRepository.findByUserAndIsPrimaryTrue(user)
                .orElseThrow(() -> new RuntimeException("User is not associated with any company"));

        Long userCompanyId = userCompanyRole.getCompany().getId();

        return tradeRequestRepository.findGlobalMarketplaceRequests(LocalDateTime.now())
                .stream()
                .filter(request -> !request.getCompany().getId().equals(userCompanyId))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Get trade requests by type
    public List<TradeRequestDto> getTradeRequestsByType(TradeType type) {
        return tradeRequestRepository.findByTradeType(type)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Search trade requests
    public List<TradeRequestDto> searchTradeRequests(Long companyId, TradeType tradeType, TradeStatus tradeStatus, Visibility visibility) {
        return tradeRequestRepository.searchTradeRequests(companyId, tradeType, tradeStatus, visibility)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Update trade request
    public TradeRequestDto updateTradeRequest(String userEmail, UUID requestId, TradeRequestDto dto) {
        UserModel user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        TradeRequestModel request = tradeRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Trade request not found"));

        // Verify ownership
        if (request.getCreatedBy().getUserId() != user.getUserId()) {
            throw new RuntimeException("You don't have permission to update this trade request");
        }

        // Update product if productId is provided
        if (dto.getProductId() != null) {
            ProductModel product = productRepository.findById(dto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            request.setProduct(product);
        } else {
            request.setProduct(null);
        }

        request.setTitle(dto.getTitle());
        request.setDescription(dto.getDescription());
        request.setQuantity(dto.getQuantity());
        request.setUnitType(dto.getUnitType());
        request.setBudgetMin(dto.getBudgetMin());
        request.setBudgetMax(dto.getBudgetMax());
        request.setCurrency(dto.getCurrency());
        request.setOriginCountry(dto.getOriginCountry());
        request.setDestinationCountry(dto.getDestinationCountry());
        request.setPreferredIncoterm(dto.getPreferredIncoterm());
        if (dto.getTradeStatus() != null) {
            request.setTradeStatus(dto.getTradeStatus());
        }
        if (dto.getVisibility() != null) {
            request.setVisibility(dto.getVisibility());
        }
        if (dto.getExpiresAt() != null) {
            request.setExpiresAt(dto.getExpiresAt());
        }

        TradeRequestModel updated = tradeRequestRepository.save(request);
        return mapToDto(updated);
    }

    // Cancel trade request
    public void cancelTradeRequest(String userEmail, UUID requestId) {
        UserModel user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        TradeRequestModel request = tradeRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Trade request not found"));

        if (request.getCreatedBy().getUserId() != user.getUserId()) {
            throw new RuntimeException("You don't have permission to cancel this trade request");
        }

        request.setTradeStatus(TradeStatus.CANCELLED);
        tradeRequestRepository.save(request);
    }

    // Delete trade request
    public void deleteTradeRequest(String userEmail, UUID requestId) {
        UserModel user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        TradeRequestModel request = tradeRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Trade request not found"));

        if (request.getCreatedBy() == null) {
            throw new RuntimeException("Trade request has no creator information");
        }

        if (request.getCreatedBy().getUserId() != user.getUserId()) {
            throw new RuntimeException("You don't have permission to delete this trade request");
        }

        tradeRequestRepository.delete(request);
    }

    // Map entity to DTO
    private TradeRequestDto mapToDto(TradeRequestModel request) {
        TradeRequestDto dto = new TradeRequestDto();
        dto.setId(request.getId());
        
        // Safely handle createdBy relationship
        if (request.getCreatedBy() != null) {
            dto.setCreatedByUserId(request.getCreatedBy().getUserId());
            dto.setCreatedByUserName(request.getCreatedBy().getFullName());
        }
        
        dto.setCompanyId(request.getCompany().getId());
        dto.setCompanyName(request.getCompany().getName());
        
        // Include product information if available
        if (request.getProduct() != null) {
            dto.setProductId(request.getProduct().getId());
            dto.setProductName(request.getProduct().getName());
            dto.setProductCategory(request.getProduct().getCategory());
        }
        
        dto.setTradeType(request.getTradeType());
        dto.setTitle(request.getTitle());
        dto.setDescription(request.getDescription());
        dto.setQuantity(request.getQuantity());
        dto.setUnitType(request.getUnitType());
        dto.setBudgetMin(request.getBudgetMin());
        dto.setBudgetMax(request.getBudgetMax());
        dto.setCurrency(request.getCurrency());
        dto.setOriginCountry(request.getOriginCountry());
        dto.setDestinationCountry(request.getDestinationCountry());
        dto.setPreferredIncoterm(request.getPreferredIncoterm());
        dto.setTradeStatus(request.getTradeStatus());
        dto.setVisibility(request.getVisibility());
        dto.setExpiresAt(request.getExpiresAt());
        dto.setCreatedAt(request.getCreatedAt());
        dto.setUpdatedAt(request.getUpdatedAt());
        return dto;
    }
}
