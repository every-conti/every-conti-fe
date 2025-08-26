import CommonResponseDto from "src/dto/common/common-response.dto";
import SignupRequestDto from "src/dto/auth/signup-request.dto";
import EmailCodeVerificationDto from "src/dto/auth/email-code-verification.dto";
import LoginRequestDto from "src/dto/auth/login-request.dto";
import { apiRequestWithRefresh } from "src/app/api/apiRequestWithRefresh";
import ApiOptions from "src/app/api/ApiOptions";
import AccessTokenDto from "src/dto/auth/access-token.dto";
import UserDto from "src/dto/user/user.dto";
import ChangePasswordDto from "src/dto/user/change-password.dto";

export const fetchSignup = async (signupRequestDto: SignupRequestDto) => {
  const apiOptions: ApiOptions = {
    method: "POST",
    data: signupRequestDto,
  };
  const res: CommonResponseDto<string> = await apiRequestWithRefresh("/member", apiOptions);
  return res;
};

export const fetchMyUserInfo = async () => {
  const apiOptions: ApiOptions = {
    requiresAuth: true,
  };
  const data: UserDto = await apiRequestWithRefresh("/member/me", apiOptions);
  return data;
};

export const fetchUserDelete = async (memberId: string) => {
  const apiOptions: ApiOptions = {
    method: "DELETE",
    requiresAuth: true,
  };
  const data = await apiRequestWithRefresh(`/member/${memberId}`, apiOptions);
  return data;
};

export const fetchUserChangePassword = async (
  memberId: string | undefined,
  changePasswordDto: ChangePasswordDto
) => {
  const apiOptions: ApiOptions = {
    method: "PATCH",
    requiresAuth: true,
    data: changePasswordDto,
  };
  const data = await apiRequestWithRefresh(`/member/${memberId}/password`, apiOptions);
  return data;
};

export const fetchUserChangeNickname = async (
  memberId: string | undefined,
  nickname: string | undefined
) => {
  const apiOptions: ApiOptions = {
    method: "PATCH",
    requiresAuth: true,
    data: nickname,
  };
  const data = await apiRequestWithRefresh(`/member/${memberId}/nickname`, apiOptions);
  return data;
};
