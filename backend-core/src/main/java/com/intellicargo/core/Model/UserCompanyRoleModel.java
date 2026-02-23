package com.intellicargo.core.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_company_roles")
public class UserCompanyRoleModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private UserModel user;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private CompanyModel company;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private RoleModel role;

    private boolean isPrimary;
    
    public UserCompanyRoleModel() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public UserModel getUser() { return user; }
    public void setUser(UserModel user) { this.user = user; }
    
    public CompanyModel getCompany() { return company; }
    public void setCompany(CompanyModel company) { this.company = company; }
    
    public RoleModel getRole() { return role; }
    public void setRole(RoleModel role) { this.role = role; }
    
    public boolean isPrimary() { return isPrimary; }
    public void setPrimary(boolean primary) { isPrimary = primary; }
}
