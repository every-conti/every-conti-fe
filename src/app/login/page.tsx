"use client";

import React, { useState } from "react";
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
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "src/components/ui/button";
import { useRouter } from "next/navigation";
import { apiRequestPost } from "src/api/apiRequestPost";
import { useAuthStore } from "src/store/useAuthStore";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiRequestPost("/auth/login", formData, false);
      if (res) {
        if (res?.accessToken) {
          useAuthStore.getState().setAccessToken(res.accessToken);
          useAuthStore.getState().setUser(res.user);
          useAuthStore.getState().fetchUser();
          router.push("/");
        } else {
          setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
      }
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
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

  return (
    <div className="flex items-center justify-center min-h-full">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">로그인</CardTitle>
          <CardDescription>계정에 로그인하여 음악을 즐겨보세요</CardDescription>
        </CardHeader>
        <CardContent>
          {/* <form onSubmit={handleSubmit} className="space-y-4"> */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

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
                  placeholder="비밀번호를 입력하세요"
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "로그인 중..." : "로그인"}
            </Button>

            <div className="text-center text-sm text-gray-600">
              계정이 없으신가요?{" "}
              <button
                type="button"
                onClick={() => router.push("/signup")}
                className="text-primary hover:underline"
              >
                회원가입
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
