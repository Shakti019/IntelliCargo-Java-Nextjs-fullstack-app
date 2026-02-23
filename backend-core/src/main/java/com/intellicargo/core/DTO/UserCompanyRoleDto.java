package com.intellicargo.core.DTO;

public class UserCompanyRoleDto {
    private Long id;
    private Long companyId;
    private String companyName;
    private Long roleId;
    private String roleName;
    private Boolean isPrimary;

    public UserCompanyRoleDto() {}

    public UserCompanyRoleDto(Long id, Long companyId, String companyName, Long roleId, String roleName, Boolean isPrimary) {
        this.id = id;
        this.companyId = companyId;
        this.companyName = companyName;
        this.roleId = roleId;
        this.roleName = roleName;
        this.isPrimary = isPrimary;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public Long getRoleId() { return roleId; }
    public void setRoleId(Long roleId) { this.roleId = roleId; }

    public String getRoleName() { return roleName; }
    public void setRoleName(String roleName) { this.roleName = roleName; }

    public Boolean getIsPrimary() { return isPrimary; }
    public void setIsPrimary(Boolean isPrimary) { this.isPrimary = isPrimary; }
}
