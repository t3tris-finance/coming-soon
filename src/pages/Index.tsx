
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // In a real app, this would connect to an API to store emails
    toast({
      title: "Thank you!",
      description: "We'll notify you when we launch.",
    });
    setEmail("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-md text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter animate-fade-in">
            Coming Soon.
          </h1>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-400">Get notified when we launch</p>
          <form onSubmit={handleSubscribe} className="flex space-x-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-900 border-gray-800"
            />
            <Button type="submit" variant="outline" className="border-gray-700 hover:bg-gray-800">
              Notify Me
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;
