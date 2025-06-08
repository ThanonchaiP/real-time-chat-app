import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token")?.value;

  if (token) redirect("/");

  return <>{children}</>;
};

export default AuthLayout;
