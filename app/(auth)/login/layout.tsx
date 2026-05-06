import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Fitosys",
  description: "Log in to your Fitosys account to manage your fitness clients, check-ins, and payments.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
