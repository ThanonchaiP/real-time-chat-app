import { Navbar } from "@/components/navbar";

const AppsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex">
      <Navbar />
      <div>Sidebar</div>
      {children}
    </div>
  );
};

export default AppsLayout;
