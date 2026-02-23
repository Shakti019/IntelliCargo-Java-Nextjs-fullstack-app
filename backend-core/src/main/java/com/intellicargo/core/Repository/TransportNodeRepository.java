package com.intellicargo.core.Repository;

import com.intellicargo.core.Model.Geo.TransportNodeModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.List;

@Repository
public interface TransportNodeRepository extends JpaRepository<TransportNodeModel, UUID> {
    List<TransportNodeModel> findByType(TransportNodeModel.NodeType type);
}
