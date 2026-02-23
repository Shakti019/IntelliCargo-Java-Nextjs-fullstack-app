package com.intellicargo.core.Repository;

import com.intellicargo.core.Model.CompanyModel;
import com.intellicargo.core.Model.TradeOrderModel;
import com.intellicargo.core.Model.TradeOrderModel.OrderStatus;
import com.intellicargo.core.Model.TradeRequestModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

@Repository
public interface TradeOrderRepository extends JpaRepository<TradeOrderModel, UUID> {
    
    // Find orders by buyer company
    List<TradeOrderModel> findByBuyerCompany(CompanyModel company);
    
    // Find orders by seller company
    List<TradeOrderModel> findBySellerCompany(CompanyModel company);
    
    // Find orders by trade request
    List<TradeOrderModel> findByTradeRequest(TradeRequestModel request);
    
    // Find orders by status
    List<TradeOrderModel> findByTradeStatus(OrderStatus status);
    
    // Find orders by buyer company and status
    List<TradeOrderModel> findByBuyerCompanyAndTradeStatus(CompanyModel company, OrderStatus status);
    
    // Find orders by seller company and status
    List<TradeOrderModel> findBySellerCompanyAndTradeStatus(CompanyModel company, OrderStatus status);
    
    // Find all orders for a company (as buyer or seller)
    @Query("SELECT o FROM TradeOrderModel o WHERE " +
           "o.buyerCompany.id = :companyId OR o.sellerCompany.id = :companyId")
    List<TradeOrderModel> findAllOrdersForCompany(@Param("companyId") Long companyId);
}

