package com.intellicargo.core.Repository;

import com.intellicargo.core.Model.Geo.TransportEdgeModel;
import com.intellicargo.core.Model.Geo.TransportNodeModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.List;

@Repository
public interface TransportEdgeRepository extends JpaRepository<TransportEdgeModel, UUID> {
    List<TransportEdgeModel> findByFromNode(TransportNodeModel fromNode);
    List<TransportEdgeModel> findByToNode(TransportNodeModel toNode);
}
