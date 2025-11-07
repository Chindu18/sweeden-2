import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, CreditCard } from "lucide-react";

interface Props {
  name: string;
  email: string;
  phone: string;
  setName: (v: string) => void;
  setEmail: (v: string) => void;
  setPhone: (v: string) => void;
}

const TicketForm: React.FC<Props> = ({ name, email, phone, setName, setEmail, setPhone }) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name" className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5 text-[#00c7a9]" /> Name
        </Label>
        <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="text-lg p-6 border-2 focus:border-accent" />
      </div>

      <div className="space-y-2 mt-3">
        <Label htmlFor="email" className="text-lg flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#00c7a9]" /> Email
        </Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="text-lg p-6 border-2 focus:border-accent" />
      </div>

      <div className="space-y-2 mt-3">
        <Label htmlFor="phone" className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5 text-[#00c7a9]" /> Contact Number
        </Label>
        <Input id="phone" type="tel" inputMode="numeric" value={phone} maxLength={11} minLength={10} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your mobile number" className="text-lg p-6 border-2 focus:border-accent" />
      </div>
    </>
  );
};

export default TicketForm;
