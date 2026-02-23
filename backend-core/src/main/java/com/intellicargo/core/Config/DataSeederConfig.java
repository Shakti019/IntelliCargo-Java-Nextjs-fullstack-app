package com.intellicargo.core.Config;

import com.intellicargo.core.Model.PermissionModel;
import com.intellicargo.core.Model.RoleModel;
import com.intellicargo.core.Repository.PermissionRepository;
import com.intellicargo.core.Repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Configuration
public class DataSeederConfig {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    public DataSeederConfig(RoleRepository roleRepository, PermissionRepository permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }

    @Bean
    public CommandLineRunner seedData() {
        return args -> {
            seedPermissions();
            seedRoles();
        };
    }

    @Transactional
    public void seedPermissions() {
        List<String> permissions = Arrays.asList(
            // Marketplace
            "CREATE_PRODUCT", "UPDATE_PRODUCT", "CREATE_TRADE", "APPROVE_TRADE", "VIEW_TRADE",
            // Logistics
            "CREATE_SHIPMENT", "UPDATE_SHIPMENT", "CONFIRM_DELIVERY", "VIEW_SHIPMENT",
            // Finance
            "CREATE_INVOICE", "VIEW_INVOICE", "PROCESS_PAYMENT",
            // Admin
            "MANAGE_USERS", "ASSIGN_ROLES", "VIEW_ALL_COMPANIES", "SUSPEND_ACCOUNT", "VIEW_ALL_COMPANY_DATA", "UPDATE_COMPANY"
        );

        for (String permName : permissions) {
            if (!permissionRepository.existsByName(permName)) {
                PermissionModel p = new PermissionModel();
                p.setName(permName);
                permissionRepository.save(p);
            }
        }
    }

    @Transactional
    public void seedRoles() {
        // --- Core Marketplace Roles ---
        createRole("IMPORTER", "COMPANY", Set.of("CREATE_TRADE", "VIEW_TRADE", "VIEW_SHIPMENT"));
        createRole("EXPORTER", "COMPANY", Set.of("CREATE_PRODUCT", "APPROVE_TRADE", "CREATE_SHIPMENT"));
        createRole("TRADER", "COMPANY", Set.of("CREATE_TRADE", "VIEW_TRADE", "CREATE_PRODUCT"));

        // --- Logistics Roles ---
        createRole("SHIPPER", "COMPANY", Set.of("CREATE_SHIPMENT", "VIEW_SHIPMENT"));
        createRole("CARRIER", "COMPANY", Set.of("UPDATE_SHIPMENT", "CONFIRM_DELIVERY"));
        createRole("LOGISTICS_PARTNER", "COMPANY", Set.of("UPDATE_SHIPMENT", "VIEW_SHIPMENT"));

        // --- Management Roles ---
        createRole("WAREHOUSE_MANAGER", "COMPANY", Set.of("CONFIRM_DELIVERY", "VIEW_SHIPMENT"));
        createRole("FINANCE_MANAGER", "COMPANY", Set.of("CREATE_INVOICE", "VIEW_INVOICE", "PROCESS_PAYMENT"));

        // --- Admin Roles ---
        createRole("COMPANY_ADMIN", "COMPANY", Set.of("MANAGE_USERS", "ASSIGN_ROLES", "VIEW_ALL_COMPANY_DATA", "UPDATE_COMPANY"));
        createRole("PLATFORM_ADMIN", "PLATFORM", Set.of("MANAGE_USERS", "ASSIGN_ROLES", "VIEW_ALL_COMPANIES", "SUSPEND_ACCOUNT"));
        createRole("SUPPORT_AGENT", "PLATFORM", Set.of("VIEW_ALL_COMPANIES", "VIEW_TRADE"));
    }

    private void createRole(String name, String scope, Set<String> permNames) {
        if (!roleRepository.existsByName(name)) {
            RoleModel role = new RoleModel();
            role.setName(name);
            role.setScope(scope);
            
            Set<PermissionModel> perms = new HashSet<>();
            for (String pName : permNames) {
                // We use findByName which returns Optional, effectively ignoring invalid perms
                permissionRepository.findByName(pName).ifPresent(perms::add);
            }
            role.setPermissions(perms);
            roleRepository.save(role);
        }
    }
}
