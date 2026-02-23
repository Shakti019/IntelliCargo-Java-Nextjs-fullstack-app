package com.intellicargo.core.Repository;

import com.intellicargo.core.Model.Geo.WarehouseModel;
import com.intellicargo.core.Model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.List;

@Repository
public interface WarehouseRepository extends JpaRepository<WarehouseModel, UUID> {
    List<WarehouseModel> findByUser(UserModel user);
}
