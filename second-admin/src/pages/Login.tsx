"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";

const API_URL = "https://swedenn-backend.onrender.com/auth";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [collectorType, setCollectorType] = useState("video speed");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password || (!isLogin && (!phone || !email || !address))) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      if (isLogin) {
        const res = await axios.post(`${API_URL}/login`, {
          username,
          password,
        });

        toast.success(res.data.message || "Login successful");

        // ✅ Save login flag and user info
        sessionStorage.setItem("loggedIn", "true");
        localStorage.setItem("id", res.data.userId);
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("collectorType", res.data.collectorType || collectorType);

        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        const res = await axios.post(`${API_URL}/register`, {
          username,
          password,
          phone,
          email,
          address,
          collectorType,
        });

        toast.success(res.data.message || "Registered successfully");
        setIsLogin(true);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary to-background p-4">
      <Card className="w-full max-w-md shadow-2xl border-2">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto p-3 bg-gradient-to-br from-primary to-red-700 rounded-2xl shadow-lg w-fit">
            <Film className="h-10 w-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-red-700 bg-clip-text text-transparent">
            Tamil Film Sweden
          </CardTitle>
          <CardDescription className="text-base">
            {isLogin ? "Admin Panel Login" : "Create an Account"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="h-11"
              />
            </div>

            {/* Optional: Register fields */}
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your address"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ticket Collector</Label>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={() => setCollectorType("video speed")}
                      className={`w-1/2 h-11 ${
                        collectorType === "video speed"
                          ? "bg-primary text-white"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      Video Speed
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setCollectorType("others")}
                      className={`w-1/2 h-11 ${
                        collectorType === "others"
                          ? "bg-primary text-white"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      Others
                    </Button>
                  </div>
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-primary to-red-700 hover:opacity-90 transition-opacity shadow-lg text-lg font-semibold"
            >
              {isLogin ? "Login" : "Register"}
            </Button>

            <div className="text-center pt-3">
              {isLogin ? (
                <p className="text-sm">
                  Don’t have an account?{" "}
                  <span
                    className="text-primary font-semibold cursor-pointer"
                    onClick={() => setIsLogin(false)}
                  >
                    Register
                  </span>
                </p>
              ) : (
                <p className="text-sm">
                  Already have an account?{" "}
                  <span
                    className="text-primary font-semibold cursor-pointer"
                    onClick={() => setIsLogin(true)}
                  >
                    Login
                  </span>
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
