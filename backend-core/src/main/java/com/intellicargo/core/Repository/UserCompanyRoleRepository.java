package com.intellicargo.core.Repository;

import com.intellicargo.core.Model.CompanyModel;
import com.intellicargo.core.Model.UserCompanyRoleModel;
import com.intellicargo.core.Model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UserCompanyRoleRepository extends JpaRepository<UserCompanyRoleModel, Long> {
    Optional<UserCompanyRoleModel> findByUserAndIsPrimaryTrue(UserModel user);
    List<UserCompanyRoleModel> findByUser(UserModel user);
    Optional<UserCompanyRoleModel> findByUserAndCompany(UserModel user, CompanyModel company);
}
