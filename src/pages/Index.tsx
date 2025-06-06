import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useRef, useState } from "react";

// Environment variables
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

// Validate environment variables
if (!GOOGLE_SCRIPT_URL || !SECRET_KEY) {
  console.error(
    "Missing required environment variables. Please check your .env file."
  );
}

const Index = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [wallet, setWallet] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    // Fetch the user's IP address
    const fetchIp = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        if (!response.ok) {
          console.error("IP retrieval error:", response.statusText);
          setIpAddress("Not provided by client");
          return;
        }
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        console.error("Unable to retrieve IP address:", error);
        setIpAddress("Client IP error");
      }
    };
    fetchIp();

    // Create hidden iframe for form submission
    const iframe = document.createElement("iframe");
    iframe.name = "hidden_iframe";
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    iframeRef.current = iframe;

    // Cleanup on component unmount
    return () => {
      if (iframe && iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    };
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if environment variables are properly configured
    if (!GOOGLE_SCRIPT_URL || !SECRET_KEY) {
      toast({
        title: "Configuration Error",
        description:
          "The application is not properly configured. Please contact the administrator.",
        variant: "destructive",
      });
      return;
    }

    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    if (!iframeRef.current) {
      toast({
        title: "Error",
        description: "Please try again",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Create invisible form for submission
    const form = document.createElement("form");
    form.method = "POST";
    form.action = GOOGLE_SCRIPT_URL;
    form.target = "hidden_iframe";
    form.style.display = "none";

    // Add hidden fields to the form
    const addField = (name: string, value: string) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    };

    addField("email", email);
    if (wallet) addField("wallet", wallet);
    addField("ip", ipAddress || "Not retrieved");
    addField("secretKey", SECRET_KEY);

    // Add and submit form
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    // Display success message
    toast({
      title: "Thank you!",
      description: "We'll notify you when we launch.",
    });

    setEmail("");
    setWallet("");
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <div className="w-full text-center space-y-8 flex-1 flex flex-col justify-center items-center">
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter animate-fade-in w-full whitespace-nowrap">
            Finance, Block by Block.
          </h1>
          {/* <p className="text-sm text-gray-500 font-light">
            We put liquidity providers and asset managers in touch with each
            other.
          </p> */}
        </div>

        <div className="space-y-2 max-w-sm mx-auto">
          {/* <p className="text-sm text-gray-400">Get notified when we launch</p> */}
          <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-900 border-gray-800 flex-1 w-72 min-w-0"
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-white text-black hover:bg-gray-200 transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Notify Me"}
              </Button>
            </div>
            <Input
              type="text"
              placeholder="Wallet address or ENS (optional)"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              className="bg-gray-900 border-gray-800"
              disabled={isSubmitting}
            />
          </form>
        </div>
      </div>
      <footer className="w-full mt-auto text-center text-xs text-gray-500">
        © 2025 t3tris. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
