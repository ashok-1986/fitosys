import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Fitosys",
  description: "Create your Fitosys account and start automating your fitness coaching business today. Start your free 14-day trial.",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
