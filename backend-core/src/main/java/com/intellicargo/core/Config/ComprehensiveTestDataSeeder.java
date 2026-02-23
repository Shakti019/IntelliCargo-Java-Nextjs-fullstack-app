package com.intellicargo.core.Config;

import com.intellicargo.core.Model.*;
import com.intellicargo.core.Repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Comprehensive Test Data Seeder for Full System Testing
 * Creates complete workflow data: Companies → Users → Products → Listings → Requests → Offers → Orders → Shipments
 * Activated with spring.profiles.active=test-full
 */
@Configuration
@Profile("test-full")
public class ComprehensiveTestDataSeeder {

    @Bean
    CommandLineRunner seedComprehensiveData(
            CompanyRepository companyRepository,
            UserRepository userRepository,
            RoleRepository roleRepository,
            PermissionRepository permissionRepository,
            UserCompanyRoleRepository userCompanyRoleRepository,
            ProductRepository productRepository,
            ProductListingRepository productListingRepository,
            TradeRequestRepository tradeRequestRepository,
            TradeOfferRepository tradeOfferRepository,
            TradeOrderRepository tradeOrderRepository,
            ShipmentRepository shipmentRepository,
            PasswordEncoder passwordEncoder) {
        
        return args -> {
            System.out.println("🚀 ====================================");
            System.out.println("🚀 COMPREHENSIVE TEST DATA SEEDING");
            System.out.println("🚀 ====================================\n");
            
            // Check if data already exists
            if (userRepository.findByEmail("john.doe@globalcorp.com").isPresent()) {
                System.out.println("⚠️  Test data already exists");
                System.out.println("🗑️  Clearing old test data...\n");
                
                // Clear in reverse dependency order
                shipmentRepository.deleteAll();
                tradeOrderRepository.deleteAll();
                tradeOfferRepository.deleteAll();
                tradeRequestRepository.deleteAll();
                productListingRepository.deleteAll();
                productRepository.deleteAll();
                userCompanyRoleRepository.deleteAll();
                userRepository.deleteAll();
                roleRepository.deleteAll();
                permissionRepository.deleteAll();
                companyRepository.deleteAll();
                
                System.out.println("✅ Old data cleared successfully\n");
            }
            
            // ===================== 1. COMPANIES =====================
            System.out.println("📊 Creating Companies...");
            
            CompanyModel company1 = new CompanyModel();
            company1.setName("Global Trade Corp");
            company1.setCountry("USA");
            company1.setCity("New York");
            company1.setIndustry("Import/Export");
            company1.setEmail("contact@globaltrade.com");
            company1.setPhone("+1-555-0100");
            company1.setWebsite("www.globaltrade.com");
            company1.setRegistrationNumber("US-GTC-2024-001");
            company1.setStatus("VERIFIED");
            company1 = companyRepository.save(company1);
            
            CompanyModel company2 = new CompanyModel();
            company2.setName("Coffee Exporters Ltd");
            company2.setCountry("Colombia");
            company2.setCity("Bogotá");
            company2.setIndustry("Agriculture/Export");
            company2.setEmail("exports@coffeeexporters.co");
            company2.setPhone("+57-1-555-0200");
            company2.setWebsite("www.coffeeexporters.co");
            company2.setRegistrationNumber("CO-CEL-2024-002");
            company2.setStatus("VERIFIED");
            company2 = companyRepository.save(company2);
            
            CompanyModel company3 = new CompanyModel();
            company3.setName("Asian Logistics Inc");
            company3.setCountry("China");
            company3.setCity("Shanghai");
            company3.setIndustry("Logistics/Freight");
            company3.setEmail("info@asianlogistics.cn");
            company3.setPhone("+86-21-555-0300");
            company3.setWebsite("www.asianlogistics.cn");
            company3.setRegistrationNumber("CN-ALI-2024-003");
            company3.setStatus("VERIFIED");
            company3 = companyRepository.save(company3);
            
            System.out.println("   ✅ Created 3 companies");
            
            // ===================== 2. PERMISSIONS =====================
            System.out.println("🔐 Creating Permissions...");
            
            PermissionModel permCreateProduct = new PermissionModel();
            permCreateProduct.setName("CREATE_PRODUCTS");
            permCreateProduct.setDescription("Can create and manage products");
            permCreateProduct = permissionRepository.save(permCreateProduct);
            
            PermissionModel permViewMarket = new PermissionModel();
            permViewMarket.setName("VIEW_MARKETPLACE");
            permViewMarket.setDescription("Can view marketplace listings");
            permViewMarket = permissionRepository.save(permViewMarket);
            
            PermissionModel permManageCompany = new PermissionModel();
            permManageCompany.setName("MANAGE_COMPANY");
            permManageCompany.setDescription("Can manage company settings");
            permManageCompany = permissionRepository.save(permManageCompany);
            
            PermissionModel permUpdateCompany = new PermissionModel();
            permUpdateCompany.setName("UPDATE_COMPANY");
            permUpdateCompany.setDescription("Can update company information");
            permUpdateCompany = permissionRepository.save(permUpdateCompany);
            
            PermissionModel permManageTrades = new PermissionModel();
            permManageTrades.setName("MANAGE_TRADES");
            permManageTrades.setDescription("Can create and manage trades");
            permManageTrades = permissionRepository.save(permManageTrades);
            
            PermissionModel permViewReports = new PermissionModel();
            permViewReports.setName("VIEW_REPORTS");
            permViewReports.setDescription("Can view analytics and reports");
            permViewReports = permissionRepository.save(permViewReports);
            
            PermissionModel permManageUsers = new PermissionModel();
            permManageUsers.setName("MANAGE_USERS");
            permManageUsers.setDescription("Can manage user accounts");
            permManageUsers = permissionRepository.save(permManageUsers);
            
            PermissionModel permViewAllCompanies = new PermissionModel();
            permViewAllCompanies.setName("VIEW_ALL_COMPANIES");
            permViewAllCompanies.setDescription("Can view all companies (platform admin)");
            permViewAllCompanies = permissionRepository.save(permViewAllCompanies);
            
            PermissionModel permSuspendAccount = new PermissionModel();
            permSuspendAccount.setName("SUSPEND_ACCOUNT");
            permSuspendAccount.setDescription("Can suspend user accounts (platform admin)");
            permSuspendAccount = permissionRepository.save(permSuspendAccount);
            
            System.out.println("   ✅ Created 9 permissions");
            
            // ===================== 3. ROLES =====================
            System.out.println("👥 Creating Roles...");
            
            RoleModel adminRole = new RoleModel();
            adminRole.setName("COMPANY_ADMIN");
            adminRole.setScope("COMPANY");
            adminRole.getPermissions().add(permCreateProduct);
            adminRole.getPermissions().add(permViewMarket);
            adminRole.getPermissions().add(permManageCompany);
            adminRole.getPermissions().add(permUpdateCompany);
            adminRole.getPermissions().add(permManageTrades);
            adminRole.getPermissions().add(permViewReports);
            adminRole.getPermissions().add(permManageUsers);
            adminRole.getPermissions().add(permViewAllCompanies);
            adminRole.getPermissions().add(permSuspendAccount);
            adminRole = roleRepository.save(adminRole);
            
            RoleModel managerRole = new RoleModel();
            managerRole.setName("TRADE_MANAGER");
            managerRole.setScope("COMPANY");
            managerRole.getPermissions().add(permViewMarket);
            managerRole.getPermissions().add(permManageTrades);
            managerRole.getPermissions().add(permViewReports);
            managerRole = roleRepository.save(managerRole);
            
            System.out.println("   ✅ Created 2 roles");
            
            // ===================== 4. USERS =====================
            System.out.println("👤 Creating Users...");
            
            UserModel user1 = new UserModel();
            user1.setEmail("john.doe@globalcorp.com");
            user1.setPasswordHash(passwordEncoder.encode("password123"));
            user1.setFullName("John Doe");
            user1.setCountry("USA");
            user1.setProvider(UserModel.AuthProvider.LOCAL);
            user1.setActive(true);
            user1.setReliabilityScore(5.0);
            user1 = userRepository.save(user1);
            
            UserCompanyRoleModel ucr1 = new UserCompanyRoleModel();
            ucr1.setUser(user1);
            ucr1.setCompany(company1);
            ucr1.setRole(adminRole);
            ucr1.setPrimary(true);
            userCompanyRoleRepository.save(ucr1);
            
            UserModel user2 = new UserModel();
            user2.setEmail("maria.garcia@coffeeexport.com");
            user2.setPasswordHash(passwordEncoder.encode("password123"));
            user2.setFullName("Maria Garcia");
            user2.setCountry("Colombia");
            user2.setProvider(UserModel.AuthProvider.LOCAL);
            user2.setActive(true);
            user2.setReliabilityScore(5.0);
            user2 = userRepository.save(user2);
            
            UserCompanyRoleModel ucr2 = new UserCompanyRoleModel();
            ucr2.setUser(user2);
            ucr2.setCompany(company2);
            ucr2.setRole(adminRole);
            ucr2.setPrimary(true);
            userCompanyRoleRepository.save(ucr2);
            
            UserModel user3 = new UserModel();
            user3.setEmail("li.wang@asianlogistics.com");
            user3.setPasswordHash(passwordEncoder.encode("password123"));
            user3.setFullName("Li Wang");
            user3.setCountry("China");
            user3.setProvider(UserModel.AuthProvider.LOCAL);
            user3.setActive(true);
            user3.setReliabilityScore(5.0);
            user3 = userRepository.save(user3);
            
            UserCompanyRoleModel ucr3 = new UserCompanyRoleModel();
            ucr3.setUser(user3);
            ucr3.setCompany(company3);
            ucr3.setRole(adminRole);
            ucr3.setPrimary(true);
            userCompanyRoleRepository.save(ucr3);
            
            System.out.println("   ✅ Created 3 users with company associations");
            
            // ===================== 5. PRODUCTS =====================
            System.out.println("📦 Creating Products...");
            
            ProductModel product1 = new ProductModel();
            product1.setCompany(company2);
            product1.setCreatedBy(user2);
            product1.setName("Premium Arabica Coffee Beans");
            product1.setCategory("Agriculture");
            product1.setHsCode("0901.21.00");
            product1.setDescription("High-quality single-origin Colombian Arabica coffee beans, shade-grown at 1,500m altitude");
            product1.setUnitType("KG");
            product1.setOriginCountry("Colombia");
            product1.setActive(true);
            product1 = productRepository.save(product1);
            
            ProductModel product2 = new ProductModel();
            product2.setCompany(company2);
            product2.setCreatedBy(user2);
            product2.setName("Organic Green Tea");
            product2.setCategory("Agriculture");
            product2.setHsCode("0902.10.00");
            product2.setDescription("Premium organic green tea leaves from Chinese mountain regions");
            product2.setUnitType("KG");
            product2.setOriginCountry("China");
            product2.setActive(true);
            product2 = productRepository.save(product2);
            
            ProductModel product3 = new ProductModel();
            product3.setCompany(company1);
            product3.setCreatedBy(user1);
            product3.setName("Industrial Electronics Components");
            product3.setCategory("Electronics");
            product3.setHsCode("8541.10.00");
            product3.setDescription("High-grade semiconductor components for industrial applications");
            product3.setUnitType("UNIT");
            product3.setOriginCountry("USA");
            product3.setActive(true);
            product3 = productRepository.save(product3);
            
            ProductModel product4 = new ProductModel();
            product4.setCompany(company2);
            product4.setCreatedBy(user2);
            product4.setName("Premium Cocoa Beans");
            product4.setCategory("Agriculture");
            product4.setHsCode("1801.00.00");
            product4.setDescription("Fine-flavor cocoa beans, ideal for chocolate manufacturing");
            product4.setUnitType("KG");
            product4.setOriginCountry("Colombia");
            product4.setActive(true);
            product4 = productRepository.save(product4);
            
            ProductModel product5 = new ProductModel();
            product5.setCompany(company1);
            product5.setCreatedBy(user1);
            product5.setName("Textile Manufacturing Machinery");
            product5.setCategory("Machinery");
            product5.setHsCode("8444.00.00");
            product5.setDescription("Advanced automated textile weaving machinery");
            product5.setUnitType("UNIT");
            product5.setOriginCountry("USA");
            product5.setActive(true);
            product5 = productRepository.save(product5);
            
            System.out.println("   ✅ Created 5 products");
            
            // ===================== 6. PRODUCT LISTINGS =====================
            System.out.println("📋 Creating Product Listings...");
            
            ProductListingModel listing1 = new ProductListingModel();
            listing1.setProduct(product1);
            listing1.setCompany(company2);
            listing1.setAvailableQuantity(new BigDecimal("10000"));
            listing1.setMinOrderQuantity(new BigDecimal("100"));
            listing1.setMaxOrderQuantity(new BigDecimal("5000"));
            listing1.setPricePerUnit(new BigDecimal("8.50"));
            listing1.setCurrency("USD");
            listing1.setIncoterm("FOB");
            listing1.setPortOfLoading("Port of Cartagena, Colombia");
            listing1.setValidUntil(LocalDate.now().plusMonths(6));
            listing1.setListingStatus(ProductListingModel.ListingStatus.OPEN);
            listing1 = productListingRepository.save(listing1);
            
            ProductListingModel listing2 = new ProductListingModel();
            listing2.setProduct(product2);
            listing2.setCompany(company2);
            listing2.setAvailableQuantity(new BigDecimal("5000"));
            listing2.setMinOrderQuantity(new BigDecimal("50"));
            listing2.setMaxOrderQuantity(new BigDecimal("2000"));
            listing2.setPricePerUnit(new BigDecimal("12.00"));
            listing2.setCurrency("USD");
            listing2.setIncoterm("CIF");
            listing2.setPortOfLoading("Port of Shanghai, China");
            listing2.setValidUntil(LocalDate.now().plusMonths(4));
            listing2.setListingStatus(ProductListingModel.ListingStatus.OPEN);
            listing2 = productListingRepository.save(listing2);
            
            ProductListingModel listing3 = new ProductListingModel();
            listing3.setProduct(product3);
            listing3.setCompany(company1);
            listing3.setAvailableQuantity(new BigDecimal("1000"));
            listing3.setMinOrderQuantity(new BigDecimal("10"));
            listing3.setMaxOrderQuantity(new BigDecimal("500"));
            listing3.setPricePerUnit(new BigDecimal("25.99"));
            listing3.setCurrency("USD");
            listing3.setIncoterm("EXW");
            listing3.setPortOfLoading("Los Angeles Port, USA");
            listing3.setValidUntil(LocalDate.now().plusMonths(12));
            listing3.setListingStatus(ProductListingModel.ListingStatus.OPEN);
            listing3 = productListingRepository.save(listing3);
            
            ProductListingModel listing4 = new ProductListingModel();
            listing4.setProduct(product4);
            listing4.setCompany(company2);
            listing4.setAvailableQuantity(new BigDecimal("8000"));
            listing4.setMinOrderQuantity(new BigDecimal("200"));
            listing4.setMaxOrderQuantity(new BigDecimal("3000"));
            listing4.setPricePerUnit(new BigDecimal("6.75"));
            listing4.setCurrency("USD");
            listing4.setIncoterm("FOB");
            listing4.setPortOfLoading("Port of Barranquilla, Colombia");
            listing4.setValidUntil(LocalDate.now().plusMonths(5));
            listing4.setListingStatus(ProductListingModel.ListingStatus.OPEN);
            listing4 = productListingRepository.save(listing4);
            
            System.out.println("   ✅ Created 4 product listings");
            
            // ===================== 7. TRADE REQUESTS =====================
            System.out.println("🤝 Creating Trade Requests...");
            
            TradeRequestModel request1 = new TradeRequestModel();
            request1.setCompany(company1);
            request1.setCreatedBy(user1);
            request1.setTradeType(TradeRequestModel.TradeType.BUY_PRODUCT);
            request1.setTitle("Looking to buy 1000 KG Premium Arabica Coffee");
            request1.setDescription("Need high-quality Arabica coffee beans for our US retail distribution network");
            request1.setQuantity(new BigDecimal("1000"));
            request1.setUnitType("KG");
            request1.setBudgetMin(new BigDecimal("7.00"));
            request1.setBudgetMax(new BigDecimal("9.00"));
            request1.setCurrency("USD");
            request1.setOriginCountry("Colombia");
            request1.setDestinationCountry("USA");
            request1.setPreferredIncoterm("CIF");
            request1.setVisibility(TradeRequestModel.Visibility.GLOBAL);
            request1.setTradeStatus(TradeRequestModel.TradeStatus.OPEN);
            request1.setExpiresAt(LocalDateTime.now().plusMonths(2));
            request1 = tradeRequestRepository.save(request1);
            
            TradeRequestModel request2 = new TradeRequestModel();
            request2.setCompany(company1);
            request2.setCreatedBy(user1);
            request2.setTradeType(TradeRequestModel.TradeType.TRANSPORT_SERVICE);
            request2.setTitle("Need Sea Freight: China to USA (20ft Container)");
            request2.setDescription("Looking for reliable freight forwarder for electronics shipment from Shanghai to Los Angeles");
            request2.setQuantity(new BigDecimal("1"));
            request2.setUnitType("CONTAINER");
            request2.setBudgetMin(new BigDecimal("2000.00"));
            request2.setBudgetMax(new BigDecimal("3000.00"));
            request2.setCurrency("USD");
            request2.setOriginCountry("China");
            request2.setDestinationCountry("USA");
            request2.setPreferredIncoterm("FOB");
            request2.setVisibility(TradeRequestModel.Visibility.GLOBAL);
            request2.setTradeStatus(TradeRequestModel.TradeStatus.OPEN);
            request2.setExpiresAt(LocalDateTime.now().plusMonths(1));
            request2 = tradeRequestRepository.save(request2);
            
            TradeRequestModel request3 = new TradeRequestModel();
            request3.setCompany(company2);
            request3.setCreatedBy(user2);
            request3.setTradeType(TradeRequestModel.TradeType.SELL_PRODUCT);
            request3.setTitle("Selling Premium Organic Green Tea - Bulk Orders Available");
            request3.setDescription("High-quality organic green tea from mountain regions, perfect for specialty tea retailers");
            request3.setQuantity(new BigDecimal("3000"));
            request3.setUnitType("KG");
            request3.setBudgetMin(new BigDecimal("10.00"));
            request3.setBudgetMax(new BigDecimal("15.00"));
            request3.setCurrency("USD");
            request3.setOriginCountry("China");
            request3.setDestinationCountry("Worldwide");
            request3.setPreferredIncoterm("FOB");
            request3.setVisibility(TradeRequestModel.Visibility.GLOBAL);
            request3.setTradeStatus(TradeRequestModel.TradeStatus.OPEN);
            request3.setExpiresAt(LocalDateTime.now().plusMonths(3));
            request3 = tradeRequestRepository.save(request3);
            
            System.out.println("   ✅ Created 3 trade requests");
            
            // ===================== 8. TRADE OFFERS =====================
            System.out.println("💼 Creating Trade Offers...");
            
            TradeOfferModel offer1 = new TradeOfferModel();
            offer1.setTradeRequest(request1);
            offer1.setOfferedByCompany(company2);
            offer1.setOfferedByUser(user2); // Maria from Coffee Exporters Ltd
            offer1.setOfferedPrice(new BigDecimal("8.25"));
            offer1.setOfferedQuantity(new BigDecimal("1000"));
            offer1.setCurrency("USD");
            offer1.setEstimatedDeliveryDays(30);
            offer1.setAdditionalTerms("Payment: 50% advance, 50% on delivery. Premium quality guaranteed with certificates.");
            offer1.setOfferStatus(TradeOfferModel.OfferStatus.PENDING);
            offer1 = tradeOfferRepository.save(offer1);
            
            TradeOfferModel offer2 = new TradeOfferModel();
            offer2.setTradeRequest(request2);
            offer2.setOfferedByCompany(company3);
            offer2.setOfferedByUser(user1); // John from Global Trade Corp
            offer2.setOfferedPrice(new BigDecimal("2500.00"));
            offer2.setOfferedQuantity(new BigDecimal("1"));
            offer2.setCurrency("USD");
            offer2.setEstimatedDeliveryDays(21);
            offer2.setAdditionalTerms("Door-to-door service with full insurance coverage and tracking included");
            offer2.setOfferStatus(TradeOfferModel.OfferStatus.ACCEPTED);
            offer2 = tradeOfferRepository.save(offer2);
            
            TradeOfferModel offer3 = new TradeOfferModel();
            offer3.setTradeRequest(request1);
            offer3.setOfferedByCompany(company2);
            offer3.setOfferedByUser(user2); // Maria from Coffee Exporters Ltd
            offer3.setOfferedPrice(new BigDecimal("8.75"));
            offer3.setOfferedQuantity(new BigDecimal("1000"));
            offer3.setCurrency("USD");
            offer3.setEstimatedDeliveryDays(25);
            offer3.setAdditionalTerms("Express delivery with premium packaging");
            offer3.setOfferStatus(TradeOfferModel.OfferStatus.REJECTED);
            offer3 = tradeOfferRepository.save(offer3);
            
            System.out.println("   ✅ Created 3 trade offers (1 pending, 1 accepted, 1 rejected)");
            
            // ===================== 9. TRADE ORDERS =====================
            System.out.println("📜 Creating Trade Orders...");
            
            TradeOrderModel order1 = new TradeOrderModel();
            order1.setTradeRequest(request2);
            order1.setAcceptedOffer(offer2);
            order1.setBuyerCompany(company1);
            order1.setSellerCompany(company3);
            order1.setFinalQuantity(new BigDecimal("1"));
            order1.setFinalPrice(new BigDecimal("2500.00"));
            order1.setCurrency("USD");
            order1.setIncoterm("FOB");
            order1.setTradeStatus(TradeOrderModel.OrderStatus.CONTRACTED);
            order1 = tradeOrderRepository.save(order1);
            
            System.out.println("   ✅ Created 1 trade order");
            
            // ===================== 10. SHIPMENTS =====================
            System.out.println("🚢 Creating Shipments...");
            
            ShipmentModel shipment1 = new ShipmentModel();
            shipment1.setOrder(order1);
            shipment1.setStatus(ShipmentModel.ShipmentStatus.PENDING);
            shipment1 = shipmentRepository.save(shipment1);
            
            System.out.println("   ✅ Created 1 shipment (pending)");
            
            // ===================== SUMMARY =====================
            System.out.println("\n✅ ====================================");
            System.out.println("✅ SEEDING COMPLETE!");
            System.out.println("✅ ====================================\n");
            
            System.out.println("📊 COMPLETE DATA SUMMARY:");
            System.out.println("   🏢 Companies: 3");
            System.out.println("   🔐 Permissions: 9");
            System.out.println("   👥 Roles: 2");
            System.out.println("   👤 Users: 3");
            System.out.println("   📦 Products: 5");
            System.out.println("   📋 Product Listings: 4");
            System.out.println("   🤝 Trade Requests: 3");
            System.out.println("   💼 Trade Offers: 3 (pending/accepted/rejected)");
            System.out.println("   📜 Trade Orders: 1");
            System.out.println("   🚢 Shipments: 1 (pending)");
            
            System.out.println("\n👥 TEST USER CREDENTIALS:");
            System.out.println("   1️⃣  john.doe@globalcorp.com / password123");
            System.out.println("       Company: Global Trade Corp (IMPORTER, USA)");
            System.out.println("       Role: COMPANY_ADMIN");
            
            System.out.println("\n   2️⃣  maria.garcia@coffeeexport.com / password123");
            System.out.println("       Company: Coffee Exporters Ltd (EXPORTER, Colombia)");
            System.out.println("       Role: COMPANY_ADMIN");
            
            System.out.println("\n   3️⃣  li.wang@asianlogistics.com / password123");
            System.out.println("       Company: Asian Logistics Inc (FREIGHT_FORWARDER, China)");
            System.out.println("       Role: COMPANY_ADMIN");
            
            System.out.println("\n🔑 Common Password: password123");
            System.out.println("\n🎯 Ready for comprehensive API testing!");
        };
    }
}
