package com.intellicargo.core.Service;

import com.intellicargo.core.Model.Geo.GeoIntelligenceNodeModel;
import com.intellicargo.core.Model.Geo.ShipmentRouteModel;
import com.intellicargo.core.Model.Geo.TransportEdgeModel;
import com.intellicargo.core.Model.Geo.TransportNodeModel;
import com.intellicargo.core.Model.ShipmentModel;
import com.intellicargo.core.Repository.GeoIntelligenceNodeRepository;
import com.intellicargo.core.Repository.ShipmentRepository;
import com.intellicargo.core.Repository.ShipmentRouteRepository;
import com.intellicargo.core.Repository.TransportEdgeRepository;
import com.intellicargo.core.Repository.TransportNodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class RouteOptimizationService {

    @Autowired
    private TransportNodeRepository nodeRepository;

    @Autowired
    private TransportEdgeRepository edgeRepository;

    @Autowired
    private GeoIntelligenceNodeRepository geoRepository;

    @Autowired
    private ShipmentRouteRepository shipmentRouteRepository;

    @Autowired
    private ShipmentRepository shipmentRepository;

    // Weights for scoring
    private static final double WEIGHT_DISTANCE = 0.30;
    private static final double WEIGHT_CONGESTION = 0.20;
    private static final double WEIGHT_WEATHER = 0.15;
    private static final double WEIGHT_TRAFFIC = 0.15;
    private static final double WEIGHT_FUEL = 0.10;
    private static final double WEIGHT_RISK = 0.10;

    /**
     * Calculates the optimal route using A* with Vector Scoring.
     */
    public ShipmentRouteModel calculateOptimalRoute(UUID shipmentId, UUID originNodeId, UUID destinationNodeId) {
        TransportNodeModel startNode = nodeRepository.findById(originNodeId)
                .orElseThrow(() -> new RuntimeException("Start Node not found"));
        TransportNodeModel endNode = nodeRepository.findById(destinationNodeId)
                .orElseThrow(() -> new RuntimeException("End Node not found"));

        // Use A* Algorithm logic here
        List<TransportNodeModel> path = aStarSearch(startNode, endNode);
        
        // Calculate totals for the found path
        BigDecimal totalDistance = BigDecimal.ZERO;
        BigDecimal totalCost = BigDecimal.ZERO;
        double totalScore = 0.0;
        
        // This is a simplified reconstruction - in real A* you'd accumulate during search
        // We'll calculate totals after finding the path for clean code structure
        if (!path.isEmpty()) {
            for (int i = 0; i < path.size() - 1; i++) {
                TransportNodeModel current = path.get(i);
                TransportNodeModel next = path.get(i + 1);
                
                // Find edge connecting current -> next
                TransportEdgeModel edge = findEdge(current, next);
                if (edge != null) {
                    totalDistance = totalDistance.add(edge.getDistanceKm());
                    totalCost = totalCost.add(edge.getBaseCost());
                    
                    if (next.getGeoNode() != null) {
                         totalScore += calculateNodePenalty(next.getGeoNode(), edge.getDistanceKm().doubleValue());
                    }
                }
            }
        }

        ShipmentModel shipment = shipmentRepository.findById(shipmentId)
            .orElseThrow(() -> new RuntimeException("Shipment not found"));

        ShipmentRouteModel route = new ShipmentRouteModel();
        route.setShipment(shipment);
        route.setTotalDistance(totalDistance);
        route.setTotalCost(totalCost);
        route.setOptimizationScore(totalScore);
        route.setRoutePath(convertPathToJson(path));
        
        // Create ShipmentModel placeholder if needed or just save route
        // For now, assuming shipment creation logic happens elsewhere or passed in
        
        return shipmentRouteRepository.save(route);
    }

    private List<TransportNodeModel> aStarSearch(TransportNodeModel start, TransportNodeModel goal) {
        // Priority Queue storing nodes to visit, ordered by f_cost (g + h)
        PriorityQueue<NodeWrapper> openSet = new PriorityQueue<>(Comparator.comparingDouble(n -> n.fCost));
        Map<UUID, NodeWrapper> allNodes = new HashMap<>();

        NodeWrapper startWrapper = new NodeWrapper(start, null, 0.0, calculateHeuristic(start, goal));
        openSet.add(startWrapper);
        allNodes.put(start.getId(), startWrapper);

        Set<UUID> closedSet = new HashSet<>();

        while (!openSet.isEmpty()) {
            NodeWrapper currentWrapper = openSet.poll();
            TransportNodeModel current = currentWrapper.node;

            if (current.getId().equals(goal.getId())) {
                return reconstructPath(currentWrapper);
            }

            closedSet.add(current.getId());

            // Get neighbors
            List<TransportEdgeModel> edges = edgeRepository.findByFromNode(current);
            for (TransportEdgeModel edge : edges) {
                TransportNodeModel neighbor = edge.getToNode();

                if (closedSet.contains(neighbor.getId())) {
                    continue;
                }

                double edgeCost = calculateEdgeCost(edge, neighbor);
                double tentativeGCost = currentWrapper.gCost + edgeCost;

                NodeWrapper neighborWrapper = allNodes.get(neighbor.getId());
                
                if (neighborWrapper == null) {
                    neighborWrapper = new NodeWrapper(neighbor, currentWrapper, tentativeGCost, calculateHeuristic(neighbor, goal));
                    allNodes.put(neighbor.getId(), neighborWrapper);
                    openSet.add(neighborWrapper);
                } else if (tentativeGCost < neighborWrapper.gCost) {
                    neighborWrapper.gCost = tentativeGCost;
                    neighborWrapper.fCost = tentativeGCost + neighborWrapper.hCost;
                    neighborWrapper.parent = currentWrapper;
                    // Re-sort priority queue (inefficient in standard PQ but functional for small graphs)
                    openSet.remove(neighborWrapper);
                    openSet.add(neighborWrapper);
                }
            }
        }

        return Collections.emptyList(); // Path not found
    }

    private double calculateEdgeCost(TransportEdgeModel edge, TransportNodeModel targetNode) {
        double distance = edge.getDistanceKm().doubleValue();
        double penalty = 0.0;

        if (targetNode.getGeoNode() != null) {
            penalty = calculateNodePenalty(targetNode.getGeoNode(), distance);
        }

        // Base cost is distance, plus AI penalty
        return distance + penalty; 
    }

    private double calculateNodePenalty(GeoIntelligenceNodeModel geoNode, double distance) {
        // Formula:
        // (0.30 × distance_km) -> Handled in base cost usually, but here we add the *extra* factors
        // The formula in prompt was "FinalScore = ...", implying edge weight.
        
        // We can treat "distance" as the base, and the rest as multipliers or additive costs.
        // Let's interpret the prompt literally:
        // Score = 0.3 * dist + 0.2 * congestion + ...
        
        // Since A* uses gCost (accumulated "cost"), we return this Score as the "cost" to traverse this edge/node.
        
        double congestion = geoNode.getCongestionProbability() != null ? geoNode.getCongestionProbability() : 0.5;
        double weather = geoNode.getWeatherIndex() != null ? geoNode.getWeatherIndex() : 0.5;
        double traffic = geoNode.getTrafficIndex() != null ? geoNode.getTrafficIndex() : 0.5;
        double fuel = geoNode.getFuelCostIndex() != null ? geoNode.getFuelCostIndex() : 0.5;
        double risk = geoNode.getRiskIndex() != null ? geoNode.getRiskIndex() : 0.5;

        // Note: Indices (weather, traffic etc) should be normalized 0-1 or 0-100. Assuming simple 0-100 logic or unitless score here.
        // Prompt said "Normalize values between 0 and 1".
        // If they are 0-1, multiplying by weights gives a small number. 
        // We sum them up.
        
        return (WEIGHT_DISTANCE * distance) 
             + (WEIGHT_CONGESTION * congestion * 100) // Scaling up to be comparable to km? Or assuming distance is small?
             + (WEIGHT_WEATHER * weather * 100)
             + (WEIGHT_TRAFFIC * traffic * 100)
             + (WEIGHT_FUEL * fuel * 100)
             + (WEIGHT_RISK * risk * 100);
    }

    private double calculateHeuristic(TransportNodeModel start, TransportNodeModel goal) {
        // Simple Euclidean distance heuristic based on Lat/Lon approximations
        if (start.getGeoNode() == null || goal.getGeoNode() == null) return 0.0;
        
        double lat1 = start.getGeoNode().getLatitude();
        double lon1 = start.getGeoNode().getLongitude();
        double lat2 = goal.getGeoNode().getLatitude();
        double lon2 = goal.getGeoNode().getLongitude();

        // Haversine-like approximation or just Euclidean for simple heuristic
        // 1 deg lat ~ 111km
        double dLat = (lat2 - lat1) * 111;
        double dLon = (lon2 - lon1) * 111 * Math.cos(Math.toRadians((lat1 + lat2) / 2));
        
        return Math.sqrt(dLat * dLat + dLon * dLon);
    }
    
    private TransportEdgeModel findEdge(TransportNodeModel from, TransportNodeModel to) {
        List<TransportEdgeModel> edges = edgeRepository.findByFromNode(from);
        return edges.stream()
            .filter(e -> e.getToNode().getId().equals(to.getId()))
            .findFirst()
            .orElse(null);
    }

    private String convertPathToJson(List<TransportNodeModel> path) {
        // Simplified JSON string Builder
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < path.size(); i++) {
            sb.append("\"").append(path.get(i).getId()).append("\"");
            if (i < path.size() - 1) sb.append(",");
        }
        sb.append("]");
        return sb.toString();
    }

    private List<TransportNodeModel> reconstructPath(NodeWrapper endNode) {
        List<TransportNodeModel> path = new ArrayList<>();
        NodeWrapper current = endNode;
        while (current != null) {
            path.add(current.node);
            current = current.parent;
        }
        Collections.reverse(path);
        return path;
    }

    // Wrapped class for A*
    private static class NodeWrapper {
        TransportNodeModel node;
        NodeWrapper parent;
        double gCost; // Cost from start
        double hCost; // Heuristic to end
        double fCost; // Total cost

        NodeWrapper(TransportNodeModel node, NodeWrapper parent, double gCost, double hCost) {
            this.node = node;
            this.parent = parent;
            this.gCost = gCost;
            this.hCost = hCost;
            this.fCost = gCost + hCost;
        }
    }
}
