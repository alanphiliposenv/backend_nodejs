import RoleRepository from "../repository/role.repository";
import { Role } from "../util/role.enum";

class RoleService {
    constructor (
        private roleRepository: RoleRepository
    ) {}

    public getAllRoles(): Role[] {
        const roles = this.roleRepository.getAllRoles();
        return roles;
    }
}

export default RoleService;
