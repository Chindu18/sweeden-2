import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Props {
  email: string;
  otp: string;
  setOtp: (v: string) => void;
  otpSent: boolean;
  otpVerified: boolean;
  sendOtp: () => Promise<void> | void;
  verifyOtp: () => Promise<void> | void;
}

const OTPVerification: React.FC<Props> = ({ email, otp, setOtp, otpSent, otpVerified, sendOtp, verifyOtp }) => {
  return (
    <div className="mb-4 space-y-3">
      <Label htmlFor="otp" className="text-lg flex items-center gap-2">OTP</Label>

      <Input
        id="otp"
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className="text-lg p-4 border-2 focus:border-accent"
        disabled={!otpSent || otpVerified}
      />

      <div className="flex gap-3">
        <Button onClick={sendOtp} className="bg-gradient-to-r from-[#0072ff] to-[#0072ff] text-white flex-1">
          {otpSent ? "Resent OTP" : "Send OTP"}
        </Button>

        <Button onClick={verifyOtp} className="bg-gradient-to-r from-[#00c6a7] to-[#00c6a7]  text-white flex-1" disabled={!otpSent || otpVerified || otp.length !== 6}>
          {otpVerified ? "Verified" : "Verify OTP"}
        </Button>
      </div>

      {otpVerified && <p className="text-green-600 font-medium mt-2">OTP Verified! You can now proceed.</p>}
    </div>
  );
};

export default OTPVerification;
