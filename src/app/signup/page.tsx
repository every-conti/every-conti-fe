"use client";
import React, { useState } from "react";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Alert, AlertDescription } from "src/components/ui/alert";
import { Progress } from "src/components/ui/progress";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  CheckCircle,
  Clock,
} from "lucide-react";

interface SignupProps {
  onSignup: (userData: any) => void;
  onSwitchToLogin: () => void;
}

export default function Signup({ onSignup, onSwitchToLogin }: SignupProps) {
  const [step, setStep] = useState<"form" | "verification" | "verified">(
    "form"
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mockVerificationCode] = useState("123456"); // 모의 인증 코드
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (formData.password !== formData.confirmPassword) {
        setError("비밀번호가 일치하지 않습니다.");
        return;
      }

      if (formData.password.length < 6) {
        setError("비밀번호는 최소 6자 이상이어야 합니다.");
        return;
      }

      // 모의 회원가입 및 이메일 발송 처리
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setEmailSent(true);
      setStep("verification");
    } catch (err) {
      setError("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const sendEmailCode = async () => {
    console.log("Sending email code...");
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setEmailSent(true);
    // 실제로는 이메일 발송 로직이 필요함
    alert("인증 이메일이 전송되었습니다. (데모용 코드: 123456)");
    setStep("verification");
  };

  const resendVerification = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setEmailSent(true);
    // 실제로는 새로운 인증 코드를 생성해야 함
    alert("인증 이메일이 다시 전송되었습니다. (데모용 코드: 123456)");
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // code - verify
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (verificationCode === mockVerificationCode) {
        setStep("verified");
        setTimeout(() => {
          onSignup({
            email: formData.email,
            name: formData.name,
            emailVerified: true,
          });
        }, 2000);
      } else {
        setError("인증 코드가 올바르지 않습니다. (데모용 코드: 123456)");
      }
    } catch (err) {
      setError("인증 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const progressValue =
    step === "form" ? 33 : step === "verification" ? 66 : 100;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-100 py-16 px-4">
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">회원가입</CardTitle>
            <CardDescription>
              {step === "form" && "새 계정을 만들어 음악을 시작하세요"}
              {step === "verification" && "이메일 인증을 완료해주세요"}
              {step === "verified" && "회원가입이 완료되었습니다!"}
            </CardDescription>
            <Progress value={progressValue} className="mt-2" />
          </CardHeader>
          <CardContent>
            {step === "form" && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">닉네임</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="닉네임을 입력하세요"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="이메일을 입력하세요"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">비밀번호</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="비밀번호를 입력하세요 (최소 6자)"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="비밀번호를 다시 입력하세요"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                  onClick={sendEmailCode}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 animate-spin" />
                      <span>이메일 발송 중...</span>
                    </div>
                  ) : (
                    "회원가입 및 인증 이메일 발송"
                  )}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  이미 계정이 있으신가요?{" "}
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-primary hover:underline"
                  >
                    로그인
                  </button>
                </div>
              </form>
            )}

            {step === "verification" && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="relative">
                    <Mail className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                    {emailSent && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>

                  <Alert className="mb-4 bg-blue-50 border-blue-200">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>{formData.email}</strong>로 인증 이메일이
                      전송되었습니다.
                    </AlertDescription>
                  </Alert>

                  <p className="text-sm text-gray-600 mb-4">
                    이메일함을 확인하여 6자리 인증 코드를 입력해주세요.
                    <br />
                    스팸 폴더도 확인해보세요.
                  </p>

                  {/* <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                    <p className="text-xs text-yellow-800">
                      <strong>데모용:</strong> 실제 이메일이 발송되지 않습니다.
                      <br />
                      인증 코드는 <strong>123456</strong>입니다.
                    </p>
                  </div> */}
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleVerification} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="verification">인증 코드</Label>
                    <Input
                      id="verification"
                      type="text"
                      placeholder="6자리 인증 코드를 입력하세요"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                      className="text-center text-lg tracking-widest"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || verificationCode.length !== 6}
                  >
                    {loading ? "인증 중..." : "이메일 인증 완료"}
                  </Button>

                  <div className="text-center space-y-2">
                    <p className="text-xs text-gray-500">
                      이메일을 받지 못하셨나요?
                    </p>
                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                      disabled={loading}
                    >
                      인증 이메일 다시 보내기
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === "verified" && (
              <div className="text-center space-y-4">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                <div>
                  <h3 className="text-lg mb-2">이메일 인증 완료!</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {formData.email}이 성공적으로 인증되었습니다.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <p className="text-sm text-green-800">
                      회원가입이 완료되었습니다.
                      <br />
                      잠시 후 메인 페이지로 이동합니다...
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
