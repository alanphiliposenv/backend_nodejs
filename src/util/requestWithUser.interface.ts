import { Role } from "./role.enum";
import { RequestWithId } from "./requestWithId.interface";

export interface RequestWithUser extends RequestWithId {
    name: string;
    username: string;
    role: Role;
}
