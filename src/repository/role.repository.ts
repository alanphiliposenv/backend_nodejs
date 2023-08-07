import { Role } from "../util/role.enum";

class RoleRepository {
    getAllRoles(): Role[] {
        const roles: Role[] = [];
        for (const role in Role) {
            roles.push(Role[role])
        }
        return roles;
    }
}

export default RoleRepository;
