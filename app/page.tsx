"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loginSuccess, setLoginSuccess] = React.useState(false);
  const [userData, setUserData] = React.useState<LoginResponse["user"] | null>(null);


  interface LoginResponse {
    success: boolean;
    message?: string;
    user?: {
      nameuser?: string;
      username?: string;
      [key: string]: any;
    };
  }

  type HandleSubmitEvent = React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement> | undefined;

  const handleSubmit = async (e: HandleSubmitEvent): Promise<void> => {
    if (e && "preventDefault" in e && typeof e.preventDefault === "function") e.preventDefault();
    
    // ตรวจสอบข้อมูลก่อนส่ง
    if (!username.trim() || !password.trim()) {
      setError("กรุณากรอก Username และ Password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("Login attempt:", { username, password });
      
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      const data: LoginResponse = await response.json();

      if (data.success) {
        setLoginSuccess(true);
        setUserData(data.user || null);
        setError("");
        // Redirect to menu or dashboard if needed
        goToMenu();
      } else {
        setError(data.message || "เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูลอีกครั้ง");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  interface KeyPressEvent extends React.KeyboardEvent<HTMLInputElement> {}

  const handleKeyPress = (e: KeyPressEvent): void => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit(e);
    }
  };

  const handleLogout = () => {
    // ลบข้อมูลและกลับหน้า login
    setLoginSuccess(false);
    setUserData(null);
    setUsername("");
    setPassword("");
    alert("ออกจากระบบเรียบร้อยแล้ว");
  };

  const goToMenu = () => {
    // ไปหน้า menu โดยตรง
    if (typeof window !== 'undefined') {
      window.location.href = '/menu';
    }
  };

  // ลบ Auth checking ออกหมด
  React.useEffect(() => {
    // ไม่ตรวจสอบ auth อะไรเลย
    console.log("Login page loaded - no auth checking");
  }, []);

  React.useEffect(() => {
    const getdata = async () => {
      await fetch("/api/get?dbname=equip", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Data fetched successfully:", data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
    getdata();
  }, []);


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Panel - Background and Welcome Text */}
        <div className="md:w-1/2 bg-gradient-to-br from-rose-800 to-rose-500 p-8 flex flex-col justify-center items-center text-white">
          <div className="w-full text-center mb-8">
            <img
              src="/icon-full.png"
              alt="logo"
              width={140}
              height={140}
              className="mx-auto mb-4"
            />
            <div className="text-lg font-bold uppercase tracking-wider mb-2">
              WELCOME TO
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">NPD Smart Logistics Hub Application</h2>
            <p className="text-sm opacity-80 max-w-md mx-auto">
              แอปพลิเคชันระบบส่งกำลังบำรุงสายช่างโยธา
              เพื่อสนับสนุนภารกิจกองทัพเรือ และรองรับสถานการณ์วิกฤต
            </p>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="md:w-1/2 py-12 px-8 md:px-12">
          <div className="text-center md:text-left mb-8">
            <h3 className="text-2xl font-bold text-gray-800">Login Account</h3>
            <p className="text-sm text-gray-500 mt-2">
              กรุณาลงชื่อเข้าสู่ระบบเพื่อใช้งานระบบส่งกำลังบำรุงสายช่างโยธา
            </p>
          </div>

          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <Input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            {/* <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                จดจำการเข้าสู่ระบบ
              </label>
            </div> */}

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className='bg-[#e43333f3] w-full py-2 text-white rounded-full !h-[42px] text-[16px] hover:bg-[#a20c0c] active:bg-[#a20c0c] disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  กำลังเข้าสู่ระบบ...
                </>
              ) : (
                "SIGN IN"
              )}
            </Button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;