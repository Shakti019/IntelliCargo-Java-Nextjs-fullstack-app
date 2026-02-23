package com.intellicargo.core.Repository;

import com.intellicargo.core.Model.TradeAdditionalDetailsModel;
import com.intellicargo.core.Model.TradeRequestModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TradeAdditionalDetailsRepository extends JpaRepository<TradeAdditionalDetailsModel, UUID> {
    Optional<TradeAdditionalDetailsModel> findByTradeRequest(TradeRequestModel request);
}
