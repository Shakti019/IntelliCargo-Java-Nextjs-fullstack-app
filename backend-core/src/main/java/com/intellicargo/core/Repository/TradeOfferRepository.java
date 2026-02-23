package com.intellicargo.core.Repository;

import com.intellicargo.core.Model.CompanyModel;
import com.intellicargo.core.Model.TradeOfferModel;
import com.intellicargo.core.Model.TradeOfferModel.OfferStatus;
import com.intellicargo.core.Model.TradeRequestModel;
import com.intellicargo.core.Model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.List;

@Repository
public interface TradeOfferRepository extends JpaRepository<TradeOfferModel, UUID> {
    
    // Find offers by trade request
    List<TradeOfferModel> findByTradeRequest(TradeRequestModel request);
    
    // Find offers by company
    List<TradeOfferModel> findByOfferedByCompany(CompanyModel company);
    
    // Find offers by user
    List<TradeOfferModel> findByOfferedByUser(UserModel user);
    
    // Find offers by status
    List<TradeOfferModel> findByOfferStatus(OfferStatus status);
    
    // Find pending offers by trade request
    List<TradeOfferModel> findByTradeRequestAndOfferStatus(TradeRequestModel request, OfferStatus status);
    
    // Find offers by company and status
    List<TradeOfferModel> findByOfferedByCompanyAndOfferStatus(CompanyModel company, OfferStatus status);
    
    // Find offers where the trade request belongs to a specific company (received offers)
    List<TradeOfferModel> findByTradeRequestCompany(CompanyModel company);
    
    // Find accepted offers where the trade request belongs to a specific company
    List<TradeOfferModel> findByTradeRequestCompanyAndOfferStatus(CompanyModel company, OfferStatus status);
}

