import RoleRepository from "../../repository/role.repository";
import RoleService from "../../service/role.service"

describe("Role Service Test", () => {
    test("Get All Roles", () => {
        const roleRepository = new RoleRepository();
        const roleService = new RoleService(roleRepository);
        const roles = roleService.getAllRoles();
        expect(roles).toContain("user");
        expect(roles).toContain("admin");
    });
});
