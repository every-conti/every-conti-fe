import CommonResponseDto from "src/dto/common/common-response.dto";
import SignupRequestDto from "src/dto/auth/signup-request.dto";
import EmailCodeVerificationDto from "src/dto/auth/email-code-verification.dto";
import LoginRequestDto from "src/dto/auth/login-request.dto";
import {apiRequestWithRefresh} from "src/app/api/apiRequestWithRefresh";
import ApiOptions from "src/app/api/ApiOptions";
import AccessTokenDto from "src/dto/auth/access-token.dto";
import UserDto from "src/dto/user/user.dto";

export const fetchLogin = async (loginRequestDto : LoginRequestDto) => {
    const apiOptions: ApiOptions = {
        method: "POST",
        data: loginRequestDto,
    }
    const res: CommonResponseDto<string> = await apiRequestWithRefresh("/auth/login", apiOptions);
    return res;
};

export const fetchSendVerificationMail = async (email: string) => {
    const apiOptions: ApiOptions = {
        method: "POST",
        data: {email},
    }
    const res: CommonResponseDto<string> = await apiRequestWithRefresh("/mail/code", apiOptions);
    return res;
}

export const fetchVerifyEmailCode = async (emailCodeVerificationDto: EmailCodeVerificationDto) => {
    const {email, userCode} = emailCodeVerificationDto;
    const res: CommonResponseDto<string> = await apiRequestWithRefresh(`/mail/code/verify?email=${email}&userCode=${userCode}`);
    return res;
}

export const fetchSignup = async (signupRequestDto: SignupRequestDto) => {
    const apiOptions: ApiOptions = {
        method: "POST",
        data: signupRequestDto,
    }
    const res: CommonResponseDto<string> = await apiRequestWithRefresh("/member", apiOptions);
    return res;
};

export const fetchNewAccessToken = async () => {
    const apiOptions: ApiOptions = {
        requiresAuth: true,
    }
    const data: AccessTokenDto = await apiRequestWithRefresh("/auth/token", apiOptions);
    return data;
}

export const fetchMyUserInfo = async () => {
    const apiOptions: ApiOptions = {
        requiresAuth: true,
    }
    const data: UserDto = await apiRequestWithRefresh("/member/me", apiOptions);
    return data;
}

export const fetchLogout = async () => {
    const apiOptions: ApiOptions = {
        requiresAuth: true,
    }
    const data: UserDto = await apiRequestWithRefresh("/auth/logout", apiOptions);
    return data;
}