package com.intellicargo.core.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utility class to generate bcrypt password hashes for seed data
 * Run this class to generate password hashes for the seed SQL file
 */
public class PasswordHashGenerator {
    
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);
        
        String password = "password123";
        
        System.out.println("==============================================");
        System.out.println("Password Hash Generator for Seed Data");
        System.out.println("==============================================");
        System.out.println();
        System.out.println("Original Password: " + password);
        System.out.println();
        System.out.println("Generated Bcrypt Hashes (use in data-seed.sql):");
        System.out.println("------------------------------------------------");
        
        // Generate 3 different hashes for 3 users (bcrypt produces unique hashes)
        for (int i = 1; i <= 3; i++) {
            String hash = encoder.encode(password);
            System.out.println("User " + i + " hash: " + hash);
        }
        
        System.out.println();
        System.out.println("==============================================");
        System.out.println("Copy these hashes to data-seed.sql file:");
        System.out.println("==============================================");
        System.out.println();
        
        // Generate with sample INSERT statements
        System.out.println("-- User 1: buyer@globalelectronics.com");
        System.out.println("INSERT INTO users (user_id, email, password, full_name, created_at, updated_at) VALUES");
        System.out.println("(1, 'buyer@globalelectronics.com', '" + encoder.encode(password) + "', 'John Buyer', NOW(), NOW());");
        System.out.println();
        
        System.out.println("-- User 2: seller@lpu.edu");
        System.out.println("INSERT INTO users (user_id, email, password, full_name, created_at, updated_at) VALUES");
        System.out.println("(2, 'seller@lpu.edu', '" + encoder.encode(password) + "', 'Sarah Seller', NOW(), NOW());");
        System.out.println();
        
        System.out.println("-- User 3: procurement@techimports.com");
        System.out.println("INSERT INTO users (user_id, email, password, full_name, created_at, updated_at) VALUES");
        System.out.println("(3, 'procurement@techimports.com', '" + encoder.encode(password) + "', 'Mike Importer', NOW(), NOW());");
        System.out.println();
        
        System.out.println("==============================================");
        System.out.println("All passwords: password123");
        System.out.println("==============================================");
    }
}
