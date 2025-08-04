import {apiRequestPost} from "src/app/api/apiRequestPost";
import CommonResponseDto from "src/dto/common/common-response.dto";
import SignupRequestDto from "src/dto/auth/signup-request.dto";
import EmailCodeVerificationDto from "src/dto/auth/email-code-verification.dto";
import LoginRequestDto from "src/dto/auth/login-request.dto";
import {apiRequestGet} from "src/app/api/apiRequestGet";

export const fetchLogin = async (loginRequestDto : LoginRequestDto) => {
    const res: CommonResponseDto<string> = await apiRequestPost("/auth/login", loginRequestDto, false);
    return res;
};

export const fetchSendVerificationMail = async (email: string) => {
    const res: CommonResponseDto<string> = await apiRequestPost("/mail/code", {email}, false);
    return res;
}

export const fetchVerifyEmailCode = async (emailCodeVerificationDto: EmailCodeVerificationDto) => {
    const {email, userCode} = emailCodeVerificationDto;
    const res: CommonResponseDto<string> = await apiRequestGet(`/mail/code/verify?email=${email}&userCode=${userCode}`,false);
    return res;
}

export const fetchSignup = async (signupRequestDto: SignupRequestDto) => {
    const res: CommonResponseDto<string> = await apiRequestPost("/member", signupRequestDto, false);
    return res;
};

