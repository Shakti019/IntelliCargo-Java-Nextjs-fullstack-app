package com.intellicargo.core.Repository;

import com.intellicargo.core.Model.CompanyModel;
import com.intellicargo.core.Model.TradeRequestModel;
import com.intellicargo.core.Model.TradeRequestModel.TradeStatus;
import com.intellicargo.core.Model.TradeRequestModel.TradeType;
import com.intellicargo.core.Model.TradeRequestModel.Visibility;
import com.intellicargo.core.Model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;

@Repository
public interface TradeRequestRepository extends JpaRepository<TradeRequestModel, UUID> {
    
    // Find by company
    List<TradeRequestModel> findByCompany(CompanyModel company);
    
    // Find by creator
    List<TradeRequestModel> findByCreatedBy(UserModel user);
    
    // Find by trade type
    List<TradeRequestModel> findByTradeType(TradeType tradeType);
    
    // Find by trade status
    List<TradeRequestModel> findByTradeStatus(TradeStatus status);
    
    // Find by visibility
    List<TradeRequestModel> findByVisibility(Visibility visibility);
    
    // Find active (OPEN) trade requests
    List<TradeRequestModel> findByTradeStatusAndExpiresAtAfter(TradeStatus status, LocalDateTime date);
    
    // Find global marketplace requests (GLOBAL visibility and OPEN status)
    @Query("SELECT tr FROM TradeRequestModel tr WHERE " +
           "tr.visibility = 'GLOBAL' AND " +
           "tr.tradeStatus = 'OPEN' AND " +
           "tr.expiresAt > :currentDate")
    List<TradeRequestModel> findGlobalMarketplaceRequests(@Param("currentDate") LocalDateTime currentDate);
    
    // Search trade requests
    @Query("SELECT tr FROM TradeRequestModel tr WHERE " +
           "(:companyId IS NULL OR tr.company.id = :companyId) AND " +
           "(:tradeType IS NULL OR tr.tradeType = :tradeType) AND " +
           "(:tradeStatus IS NULL OR tr.tradeStatus = :tradeStatus) AND " +
           "(:visibility IS NULL OR tr.visibility = :visibility)")
    List<TradeRequestModel> searchTradeRequests(@Param("companyId") Long companyId,
                                                @Param("tradeType") TradeType tradeType,
                                                @Param("tradeStatus") TradeStatus tradeStatus,
                                                @Param("visibility") Visibility visibility);
}

