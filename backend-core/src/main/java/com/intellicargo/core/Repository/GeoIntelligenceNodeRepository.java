package com.intellicargo.core.Repository;

import com.intellicargo.core.Model.Geo.GeoIntelligenceNodeModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.List;

@Repository
public interface GeoIntelligenceNodeRepository extends JpaRepository<GeoIntelligenceNodeModel, UUID> {
    
    // TEMPORARILY DISABLED - Requires PostGIS and pgvector extensions
    // Enable these methods after running:
    // CREATE EXTENSION postgis;
    // CREATE EXTENSION vector;
    
    // Find nearest geo nodes by spatial distance (PostGIS)
    // @Query(value = "SELECT * FROM geo_intelligence_nodes ORDER BY location <-> ST_SetSRID(ST_MakePoint(:lon, :lat), 4326) LIMIT 1", nativeQuery = true)
    // GeoIntelligenceNodeModel findNearestNode(double lon, double lat);

    // Find similar nodes based on vector features (pgvector)
    // Using Euclidean distance (<->) operator
    // @Query(value = "SELECT * FROM geo_intelligence_nodes ORDER BY feature_vector <-> cast(:vectorString as vector) LIMIT :limit", nativeQuery = true)
    // List<GeoIntelligenceNodeModel> findSimilarNodes(String vectorString, int limit);
}
