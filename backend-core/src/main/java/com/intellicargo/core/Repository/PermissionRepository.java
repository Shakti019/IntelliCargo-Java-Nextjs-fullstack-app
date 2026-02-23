package com.intellicargo.core.Repository;

import com.intellicargo.core.Model.PermissionModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PermissionRepository extends JpaRepository<PermissionModel, Long> {
    Optional<PermissionModel> findByName(String name);
    boolean existsByName(String name);
}
