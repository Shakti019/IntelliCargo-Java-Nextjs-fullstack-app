package com.intellicargo.core.DTO;

import java.util.Set;

public class RoleDto {
    private Long id;
    private String name;
    private String scope;
    private Set<String> permissions; // Just permission names for simplicity

    public RoleDto() {}

    public RoleDto(Long id, String name, String scope, Set<String> permissions) {
        this.id = id;
        this.name = name;
        this.scope = scope;
        this.permissions = permissions;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getScope() { return scope; }
    public void setScope(String scope) { this.scope = scope; }

    public Set<String> getPermissions() { return permissions; }
    public void setPermissions(Set<String> permissions) { this.permissions = permissions; }
}
