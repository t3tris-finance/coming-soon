
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Calculate time until launch date (set 30 days from now)
  useEffect(() => {
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 30);

    const calculateTimeLeft = () => {
      const difference = +launchDate - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

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
          <p className="text-gray-400 text-sm sm:text-base">
            We're working on something exciting.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2 py-8">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="text-center">
              <div className="text-xl sm:text-3xl font-mono">{value}</div>
              <div className="text-xs text-gray-500 capitalize">{unit}</div>
            </div>
          ))}
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
