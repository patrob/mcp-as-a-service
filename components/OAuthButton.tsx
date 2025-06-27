"use client";

import { Github, Mail } from "lucide-react";
import { signIn } from "next-auth/react";

type OAuthProvider = "github" | "google";

interface OAuthButtonProps {
  provider: OAuthProvider;
  className?: string;
}

const providerConfig = {
  github: {
    icon: Github,
    label: "GitHub",
    providerId: "github",
  },
  google: {
    icon: Mail,
    label: "Google",
    providerId: "google",
  },
};

export function OAuthButton({ provider, className = "" }: OAuthButtonProps) {
  const config = providerConfig[provider];
  const Icon = config.icon;

  const handleClick = async () => {
    try {
      console.log(`Attempting to sign in with ${config.providerId}`);
      const result = await signIn(config.providerId, {
        callbackUrl: "/dashboard",
        redirect: true,
      });
      console.log("SignIn result:", result);
    } catch (error) {
      console.error("SignIn error:", error);
    }
  };

  const buttonText = `Continue with ${config.label}`;

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors ${className}`}
    >
      <Icon className="h-5 w-5 text-slate-700" />
      <span className="font-medium text-slate-700">{buttonText}</span>
    </button>
  );
}

