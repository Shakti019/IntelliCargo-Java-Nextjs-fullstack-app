package com.intellicargo.core.Service;

import com.intellicargo.core.DTO.ProductDto;
import com.intellicargo.core.Model.CompanyModel;
import com.intellicargo.core.Model.ProductModel;
import com.intellicargo.core.Model.UserCompanyRoleModel;
import com.intellicargo.core.Model.UserModel;
import com.intellicargo.core.Repository.CompanyRepository;
import com.intellicargo.core.Repository.ProductRepository;
import com.intellicargo.core.Repository.UserCompanyRoleRepository;
import com.intellicargo.core.Repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final UserCompanyRoleRepository userCompanyRoleRepository;

    public ProductService(ProductRepository productRepository, CompanyRepository companyRepository,
                         UserRepository userRepository, UserCompanyRoleRepository userCompanyRoleRepository) {
        this.productRepository = productRepository;
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
        this.userCompanyRoleRepository = userCompanyRoleRepository;
    }

    // Create a new product
    public ProductDto createProduct(String userEmail, ProductDto productDto) {
        UserModel user = userRepository.findByEmailIgnoreCase(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Get user's company
        UserCompanyRoleModel userCompanyRole = userCompanyRoleRepository.findByUserAndIsPrimaryTrue(user)
                .orElseThrow(() -> new RuntimeException("User is not associated with any company"));

        CompanyModel company = userCompanyRole.getCompany();

        ProductModel product = new ProductModel();
        product.setCompany(company);
        product.setCreatedBy(user);
        product.setName(productDto.getName());
        product.setCategory(productDto.getCategory());
        product.setHsCode(productDto.getHsCode());
        product.setDescription(productDto.getDescription());
        product.setUnitType(productDto.getUnitType());
        product.setMinOrderQuantity(productDto.getMinOrderQuantity());
        product.setOriginCountry(productDto.getOriginCountry());
        product.setActive(productDto.getIsActive() != null ? productDto.getIsActive() : true);

        ProductModel saved = productRepository.save(product);
        return mapToDto(saved);
    }

    // Get product by ID
    public ProductDto getProductById(UUID id) {
        ProductModel product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return mapToDto(product);
    }

    // Get all products for user's company
    public List<ProductDto> getMyCompanyProducts(String userEmail) {
        UserModel user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserCompanyRoleModel userCompanyRole = userCompanyRoleRepository.findByUserAndIsPrimaryTrue(user)
                .orElseThrow(() -> new RuntimeException("User is not associated with any company"));

        return productRepository.findByCompanyAndIsActiveTrue(userCompanyRole.getCompany())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Get all active products
    public List<ProductDto> getAllActiveProducts() {
        return productRepository.findByIsActiveTrue()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Get products by category
    public List<ProductDto> getProductsByCategory(String category) {
        return productRepository.findByCategoryAndIsActiveTrue(category)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Search products with filters
    public List<ProductDto> searchProducts(Long companyId, String category, String originCountry, Boolean isActive) {
        return productRepository.searchProducts(companyId, category, originCountry, isActive)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Update product
    public ProductDto updateProduct(String userEmail, UUID productId, ProductDto productDto) {
        UserModel user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        ProductModel product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Verify user has access to this product (belongs to same company)
        UserCompanyRoleModel userCompanyRole = userCompanyRoleRepository.findByUserAndIsPrimaryTrue(user)
                .orElseThrow(() -> new RuntimeException("User is not associated with any company"));

        if (!product.getCompany().getId().equals(userCompanyRole.getCompany().getId())) {
            throw new RuntimeException("You don't have permission to update this product");
        }

        product.setName(productDto.getName());
        product.setCategory(productDto.getCategory());
        product.setHsCode(productDto.getHsCode());
        product.setDescription(productDto.getDescription());
        product.setUnitType(productDto.getUnitType());
        product.setMinOrderQuantity(productDto.getMinOrderQuantity());
        product.setOriginCountry(productDto.getOriginCountry());
        if (productDto.getIsActive() != null) {
            product.setActive(productDto.getIsActive());
        }

        ProductModel updated = productRepository.save(product);
        return mapToDto(updated);
    }

    // Delete (soft delete - set inactive) product
    public void deleteProduct(String userEmail, UUID productId) {
        UserModel user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        ProductModel product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Verify user has access to this product
        UserCompanyRoleModel userCompanyRole = userCompanyRoleRepository.findByUserAndIsPrimaryTrue(user)
                .orElseThrow(() -> new RuntimeException("User is not associated with any company"));

        if (!product.getCompany().getId().equals(userCompanyRole.getCompany().getId())) {
            throw new RuntimeException("You don't have permission to delete this product");
        }

        product.setActive(false);
        productRepository.save(product);
    }

    // Map entity to DTO
    private ProductDto mapToDto(ProductModel product) {
        return new ProductDto(
                product.getId(),
                product.getCompany().getId(),
                product.getCompany().getName(),
                product.getCreatedBy() != null ? product.getCreatedBy().getUserId() : null,
                product.getCreatedBy() != null ? product.getCreatedBy().getFullName() : null,
                product.getName(),
                product.getCategory(),
                product.getHsCode(),
                product.getDescription(),
                product.getUnitType(),
                product.getMinOrderQuantity(),
                product.getOriginCountry(),
                product.getActive(),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }
}
