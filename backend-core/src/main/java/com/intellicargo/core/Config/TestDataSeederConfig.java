package com.intellicargo.core.Config;

import com.intellicargo.core.Model.*;
import com.intellicargo.core.Model.ProductListingModel.ListingStatus;
import com.intellicargo.core.Model.TradeRequestModel.*;
import com.intellicargo.core.Repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Test Data Seeder for API Testing
 * Only runs when profile 'test' or 'dev' is active
 * Enable with: --spring.profiles.active=test
 */
@Configuration
@Profile({"test", "dev"})
public class TestDataSeederConfig {

    @Bean
    CommandLineRunner seedTestData(
            CompanyRepository companyRepository,
            UserRepository userRepository,
            RoleRepository roleRepository,
            PermissionRepository permissionRepository,
            UserCompanyRoleRepository userCompanyRoleRepository,
            ProductRepository productRepository,
            ProductListingRepository productListingRepository,
            TradeRequestRepository tradeRequestRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            System.out.println("🌱 Seeding test data for API testing...");

            // 1. Create Companies
            CompanyModel company1 = createCompanyIfNotExists(companyRepository, 
                "Global Trade Corp", "REG-2024-001", "USA", "ACTIVE");
            CompanyModel company2 = createCompanyIfNotExists(companyRepository, 
                "Coffee Exporters Ltd", "REG-2024-002", "Colombia", "ACTIVE");
            CompanyModel company3 = createCompanyIfNotExists(companyRepository, 
                "Asian Logistics Inc", "REG-2024-003", "China", "ACTIVE");

            // 2. Create Roles and Permissions
            PermissionModel viewProductsPerm = createPermissionIfNotExists(permissionRepository, 
                "VIEW_PRODUCTS", "Can view products");
            PermissionModel createProductsPerm = createPermissionIfNotExists(permissionRepository, 
                "CREATE_PRODUCTS", "Can create products");
            PermissionModel manageTradePerm = createPermissionIfNotExists(permissionRepository, 
                "MANAGE_TRADES", "Can manage trade requests and offers");

            RoleModel companyAdminRole = createRoleIfNotExists(roleRepository, 
                "COMPANY_ADMIN", "COMPANY");
            companyAdminRole.getPermissions().add(viewProductsPerm);
            companyAdminRole.getPermissions().add(createProductsPerm);
            companyAdminRole.getPermissions().add(manageTradePerm);
            roleRepository.save(companyAdminRole);

            // 3. Create Users
            UserModel user1 = createUserIfNotExists(userRepository, passwordEncoder,
                "john.doe@globalcorp.com", "password123", "John Doe", "USA");
            UserModel user2 = createUserIfNotExists(userRepository, passwordEncoder,
                "maria.garcia@coffeeexport.com", "password123", "Maria Garcia", "Colombia");
            UserModel user3 = createUserIfNotExists(userRepository, passwordEncoder,
                "li.wang@asianlogistics.com", "password123", "Li Wang", "China");

            // 4. Assign Users to Companies
            createUserCompanyRoleIfNotExists(userCompanyRoleRepository, user1, company1, companyAdminRole, true);
            createUserCompanyRoleIfNotExists(userCompanyRoleRepository, user2, company2, companyAdminRole, true);
            createUserCompanyRoleIfNotExists(userCompanyRoleRepository, user3, company3, companyAdminRole, true);

            // 5. Create Products
            ProductModel coffee = createProduct(productRepository, company2, user2,
                "Premium Arabica Coffee Beans", "Agriculture", "0901.21",
                "High-quality single-origin Arabica coffee beans from Colombian highlands",
                "KG", "Colombia");

            ProductModel tea = createProduct(productRepository, company3, user3,
                "Premium Green Tea", "Agriculture", "0902.10",
                "Organic green tea from Chinese mountain regions",
                "KG", "China");

            ProductModel electronics = createProduct(productRepository, company3, user3,
                "Electronic Components", "Electronics", "8542.39",
                "High-quality semiconductor components",
                "UNIT", "China");

            // 6. Create Product Listings
            createProductListing(productListingRepository, coffee, company2,
                new BigDecimal("5000"), new BigDecimal("100"), new BigDecimal("2000"),
                new BigDecimal("8.50"), "USD", "FOB", "Port of Cartagena",
                LocalDate.now().plusMonths(6));

            createProductListing(productListingRepository, tea, company3,
                new BigDecimal("3000"), new BigDecimal("50"), new BigDecimal("1000"),
                new BigDecimal("12.00"), "USD", "FOB", "Port of Shanghai",
                LocalDate.now().plusMonths(4));

            createProductListing(productListingRepository, electronics, company3,
                new BigDecimal("10000"), new BigDecimal("500"), new BigDecimal("5000"),
                new BigDecimal("2.50"), "USD", "EXW", "Shenzhen Factory",
                LocalDate.now().plusMonths(3));

            // 7. Create Trade Requests
            createTradeRequest(tradeRequestRepository, user1, company1,
                TradeType.BUY_PRODUCT, "Looking to buy 1000 KG Premium Coffee",
                "Need high-quality Arabica coffee beans for our retail chain",
                new BigDecimal("1000"), "KG", new BigDecimal("7.00"), new BigDecimal("9.00"),
                "USD", "Colombia", "USA", "CIF", Visibility.GLOBAL,
                LocalDateTime.now().plusMonths(1));

            createTradeRequest(tradeRequestRepository, user1, company1,
                TradeType.TRANSPORT_SERVICE, "Sea freight from Shanghai to Los Angeles",
                "Need 40ft container transport for electronics",
                new BigDecimal("1"), "CONTAINER", new BigDecimal("2000"), new BigDecimal("3000"),
                "USD", "China", "USA", "FOB", Visibility.GLOBAL,
                LocalDateTime.now().plusMonths(2));

            createTradeRequest(tradeRequestRepository, user2, company2,
                TradeType.SELL_PRODUCT, "Premium Coffee Beans for Sale",
                "Selling 2000 KG of premium Arabica coffee beans",
                new BigDecimal("2000"), "KG", new BigDecimal("8.00"), new BigDecimal("10.00"),
                "USD", "Colombia", "Worldwide", "FOB", Visibility.GLOBAL,
                LocalDateTime.now().plusMonths(3));

            System.out.println("✅ Test data seeding completed!");
            System.out.println("\n📝 Test Credentials:");
            System.out.println("   User 1: john.doe@globalcorp.com / password123");
            System.out.println("   User 2: maria.garcia@coffeeexport.com / password123");
            System.out.println("   User 3: li.wang@asianlogistics.com / password123");
            System.out.println("\n🏢 Companies created: 3");
            System.out.println("📦 Products created: 3");
            System.out.println("📋 Product listings created: 3");
            System.out.println("🤝 Trade requests created: 3");
        };
    }

    // Helper methods
    private CompanyModel createCompanyIfNotExists(CompanyRepository repo, String name, String regNum, String country, String status) {
        return repo.findByName(name).orElseGet(() -> {
            CompanyModel company = new CompanyModel();
            company.setName(name);
            company.setRegistrationNumber(regNum);
            company.setCountry(country);
            company.setStatus(status);
            return repo.save(company);
        });
    }

    private UserModel createUserIfNotExists(UserRepository repo, PasswordEncoder encoder, String email, String password, String fullName, String country) {
        return repo.findByEmail(email).orElseGet(() -> {
            UserModel user = new UserModel();
            user.setEmail(email);
            user.setPasswordHash(encoder.encode(password));
            user.setFullName(fullName);
            user.setCountry(country);
            user.setProvider(UserModel.AuthProvider.LOCAL);
            user.setActive(true);
            user.setReliabilityScore(5.0);
            return repo.save(user);
        });
    }

    private PermissionModel createPermissionIfNotExists(PermissionRepository repo, String name, String description) {
        return repo.findByName(name).orElseGet(() -> {
            PermissionModel permission = new PermissionModel();
            permission.setName(name);
            permission.setDescription(description);
            return repo.save(permission);
        });
    }

    private RoleModel createRoleIfNotExists(RoleRepository repo, String name, String scope) {
        return repo.findByName(name).orElseGet(() -> {
            RoleModel role = new RoleModel();
            role.setName(name);
            role.setScope(scope);
            return repo.save(role);
        });
    }

    private void createUserCompanyRoleIfNotExists(UserCompanyRoleRepository repo, UserModel user, CompanyModel company, RoleModel role, boolean isPrimary) {
        Optional<UserCompanyRoleModel> existing = repo.findByUserAndCompany(user, company);
        if (existing.isEmpty()) {
            UserCompanyRoleModel ucr = new UserCompanyRoleModel();
            ucr.setUser(user);
            ucr.setCompany(company);
            ucr.setRole(role);
            ucr.setPrimary(isPrimary);
            repo.save(ucr);
        }
    }

    private ProductModel createProduct(ProductRepository repo, CompanyModel company, UserModel creator,
                                       String name, String category, String hsCode, String description,
                                       String unitType, String originCountry) {
        ProductModel product = new ProductModel();
        product.setCompany(company);
        product.setCreatedBy(creator);
        product.setName(name);
        product.setCategory(category);
        product.setHsCode(hsCode);
        product.setDescription(description);
        product.setUnitType(unitType);
        product.setOriginCountry(originCountry);
        product.setActive(true);
        return repo.save(product);
    }

    private void createProductListing(ProductListingRepository repo, ProductModel product, CompanyModel company,
                                      BigDecimal availableQty, BigDecimal minQty, BigDecimal maxQty,
                                      BigDecimal price, String currency, String incoterm, String port,
                                      LocalDate validUntil) {
        ProductListingModel listing = new ProductListingModel();
        listing.setProduct(product);
        listing.setCompany(company);
        listing.setAvailableQuantity(availableQty);
        listing.setMinOrderQuantity(minQty);
        listing.setMaxOrderQuantity(maxQty);
        listing.setPricePerUnit(price);
        listing.setCurrency(currency);
        listing.setIncoterm(incoterm);
        listing.setPortOfLoading(port);
        listing.setValidUntil(validUntil);
        listing.setListingStatus(ListingStatus.OPEN);
        repo.save(listing);
    }

    private void createTradeRequest(TradeRequestRepository repo, UserModel creator, CompanyModel company,
                                    TradeType type, String title, String description,
                                    BigDecimal quantity, String unitType, BigDecimal budgetMin, BigDecimal budgetMax,
                                    String currency, String origin, String destination, String incoterm,
                                    Visibility visibility, LocalDateTime expiresAt) {
        TradeRequestModel request = new TradeRequestModel();
        request.setCreatedBy(creator);
        request.setCompany(company);
        request.setTradeType(type);
        request.setTitle(title);
        request.setDescription(description);
        request.setQuantity(quantity);
        request.setUnitType(unitType);
        request.setBudgetMin(budgetMin);
        request.setBudgetMax(budgetMax);
        request.setCurrency(currency);
        request.setOriginCountry(origin);
        request.setDestinationCountry(destination);
        request.setPreferredIncoterm(incoterm);
        request.setTradeStatus(TradeStatus.OPEN);
        request.setVisibility(visibility);
        request.setExpiresAt(expiresAt);
        repo.save(request);
    }
}
