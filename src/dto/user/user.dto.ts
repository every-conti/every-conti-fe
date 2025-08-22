import { UserRoleTypes } from "src/types/user-role.types";
import UserSimpleDto from "src/dto/user/user-simple.dto";

export default interface UserDto extends UserSimpleDto {
  email: string;
  church: string;
  roles: UserRoleTypes[];
  profileImage: string;
}
