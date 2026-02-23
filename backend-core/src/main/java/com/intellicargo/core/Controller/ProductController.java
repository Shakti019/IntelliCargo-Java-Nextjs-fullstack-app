package com.intellicargo.core.Controller;

import com.intellicargo.core.DTO.ProductDto;
import com.intellicargo.core.Service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Create a new product
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProductDto> createProduct(@RequestBody ProductDto productDto, 
                                                    Authentication authentication) {
        ProductDto created = productService.createProduct(authentication.getName(), productDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Get product by ID
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProductDto> getProductById(@PathVariable UUID id) {
        ProductDto product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    // Get all products for current user's company
    @GetMapping("/my-company")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ProductDto>> getMyCompanyProducts(Authentication authentication) {
        List<ProductDto> products = productService.getMyCompanyProducts(authentication.getName());
        return ResponseEntity.ok(products);
    }

    // Get all active products (public marketplace)
    @GetMapping("/active")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ProductDto>> getAllActiveProducts() {
        List<ProductDto> products = productService.getAllActiveProducts();
        return ResponseEntity.ok(products);
    }

    // Get products by category
    @GetMapping("/category/{category}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ProductDto>> getProductsByCategory(@PathVariable String category) {
        List<ProductDto> products = productService.getProductsByCategory(category);
        return ResponseEntity.ok(products);
    }

    // Search products with filters
    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ProductDto>> searchProducts(
            @RequestParam(required = false) Long companyId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String originCountry,
            @RequestParam(required = false) Boolean isActive) {
        List<ProductDto> products = productService.searchProducts(companyId, category, originCountry, isActive);
        return ResponseEntity.ok(products);
    }

    // Update product
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable UUID id, 
                                                    @RequestBody ProductDto productDto,
                                                    Authentication authentication) {
        ProductDto updated = productService.updateProduct(authentication.getName(), id, productDto);
        return ResponseEntity.ok(updated);
    }

    // Delete (deactivate) product
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id, Authentication authentication) {
        productService.deleteProduct(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
