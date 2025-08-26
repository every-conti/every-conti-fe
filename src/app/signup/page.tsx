"use client";
import React, { useEffect, useState } from "react";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import { Alert, AlertDescription } from "src/components/ui/alert";
import { Progress } from "src/components/ui/progress";
import { Eye, EyeOff, Mail, Lock, User, CheckCircle, Clock, Church } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchSendVerificationMail, fetchVerifyEmailCode } from "src/app/api/auth";
import { fetchSignup } from "src/app/api/user";
import { toast } from "sonner";

export default function Signup() {
  const router = useRouter();

  const [step, setStep] = useState<"form" | "verification" | "verified">("form");
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    church: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sending, setSending] = useState(false); // 이메일 재전송 중
  const [verifying, setVerifying] = useState(false); // 인증 코드 검증 중

  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const [timeLeft, setTimeLeft] = useState(180); // 3분
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  useEffect(() => {
    if (step === "verified") {
      const timer = setTimeout(() => {
        router.replace("/login");
      }, 2000); // 2초 후 이동

      return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 클리어
    }
  }, [step, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");

    sendEmailCode();
  };

  const validateFromDatas = () => {
    if (formData.name.length < 3) {
      setError("이름은 3글자 이상이어야 합니다.");
      setSending(false);
      return false;
    }

    if (formData.nickname.length < 3) {
      setError("닉네임은 3글자 이상이어야 합니다.");
      setSending(false);
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      setSending(false);
      return false;
    }

    if (formData.password.replace(/\s/g, "").length < 6) {
      setError("비밀번호는 공백 제외 최소 6자 이상이어야 합니다.");
      setSending(false);
      return false;
    }

    if (formData.church.length < 1) {
      setError("교회 이름을 입력해주세요.");
      setSending(false);
      return false;
    }

    return true;
  };

  const sendEmailCode = async () => {
    const validation = validateFromDatas();
    if (!validation) return;

    setSending(true);
    try {
      await fetchSendVerificationMail(formData.email);
      toast.success("인증 이메일이 전송되었습니다.");
      setEmailSent(true);
      setStep("verification");

      setTimeLeft(180);
      setTimerActive(true);
    } catch (e) {
      toast.error("이메일 발송 실패했습니다.");
    } finally {
      setSending(false);
    }
  };

  const completeSignup = async () => {
    try {
      const result = await fetchSignup({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        nickname: formData.nickname,
        church: formData.church,
      });

      if (result.success) {
        setStep("verified");
      } else {
        setError(result.data || "회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (err: any) {
      if (err.status === 409 || err.code === 409) {
        setError("이미 존재하는 이메일입니다.");
      } else {
        setError("서버 오류로 회원가입에 실패했습니다.");
      }
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setError("");

    try {
      const res = await fetchVerifyEmailCode({ email: formData.email, userCode: verificationCode });
      if (res.success) {
        completeSignup();
      } else {
        setError("인증 코드가 올바르지 않습니다.");
      }
    } catch (err) {
      setError("인증 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setVerifying(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const progressValue = step === "form" ? 33 : step === "verification" ? 66 : 100;

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-192px)] bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="flex items-center justify-center w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">회원가입</CardTitle>
            <CardDescription>
              {step === "form" && "새 계정을 만들어 음악을 시작하세요"}
              {step === "verification" && "이메일 인증을 완료해주세요"}
              {step === "verified" && "회원가입이 완료되었습니다!"}
            </CardDescription>
            <Progress value={progressValue} className="mt-2 mb-2" />
          </CardHeader>
          <CardContent>
            {step === "form" && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="이름을 입력하세요"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nickname">닉네임</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="nickname"
                      name="nickname"
                      type="text"
                      placeholder="닉네임을 입력하세요"
                      value={formData.nickname}
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
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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

                <div className="space-y-2">
                  <Label htmlFor="church">교회 이름</Label>
                  <div className="relative">
                    <Church className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="church"
                      name="church"
                      type="text"
                      placeholder="수원 아바교회"
                      value={formData.church}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={sending} onClick={sendEmailCode}>
                  {sending ? (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 animate-spin" />
                      <span>이메일 발송 중...</span>
                    </div>
                  ) : (
                    "인증 이메일 발송"
                  )}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  이미 계정이 있으신가요?{" "}
                  <button
                    type="button"
                    onClick={() => router.replace("/login")}
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
                      <strong>{formData.email}</strong>로 인증 이메일이 전송되었습니다.
                    </AlertDescription>
                  </Alert>

                  <p className="text-sm text-gray-600 mb-4">
                    이메일함을 확인하여 6자리 인증 코드를 입력해주세요.
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleVerification} className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="verification">인증 코드</Label>
                      <p className="text-sm text-gray-500">
                        유효 시간:{" "}
                        <span className="font-semibold text-gray-800">
                          {Math.floor(timeLeft / 60)
                            .toString()
                            .padStart(1, "0")}{" "}
                          : {(timeLeft % 60).toString().padStart(2, "0")}
                        </span>
                      </p>
                    </div>
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
                    disabled={verifying || verificationCode.length !== 6}
                  >
                    {verifying ? "인증 중..." : "이메일 인증 완료"}
                  </Button>

                  <div className="text-center space-y-2">
                    <p className="text-xs text-gray-500">이메일을 받지 못하셨나요?</p>
                    <Button
                      type="button"
                      className="w-full"
                      variant="outline"
                      onClick={sendEmailCode}
                      disabled={sending}
                    >
                      {sending ? (
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 animate-spin" />
                          <span>이메일 재전송 중...</span>
                        </div>
                      ) : (
                        "인증 이메일 다시 보내기"
                      )}
                    </Button>
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
                      회원가입이 완료되었습니다. 로그인 해주세요.
                      <br />
                      잠시 후 로그인 페이지로 이동합니다...
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
