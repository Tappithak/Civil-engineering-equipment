"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { User, Lock } from "lucide-react";

const LoginPage = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = () => {
    console.log("Login attempt:", { username, password });
    // Add your login logic here
  };

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
            {/* <h1 className="text-3xl font-bold mb-6">WELCOME BACK</h1> */}
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

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="flex items-center justify-between"></div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <Input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
              </div>

                <Button
                    onClick={handleSubmit}
                    className='bg-[#e43333f3] w-full py-2 text-white rounded-full !h-[42px] text-[16px] hover:bg-[#a20c0c] active:bg-[#a20c0c]'
                  >
                    SIGN IN
                  </Button>


            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
