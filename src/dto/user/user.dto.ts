import { UserRoleTypes } from "src/types/user-role.types";

export default interface UserDto {
  id: string;
  nickname: string;
  email: string;
  church: string;
  roles: UserRoleTypes[];
}
