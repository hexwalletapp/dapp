import { useEffect, useState } from "react";
import Meta from "~/components/Meta";
import LeftNav from "~/components/ui/LeftNav";
import { SideMenuProvider } from "~/contexts/SideMenuContext";
const Layout = ({ children }: any) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <Meta />
      <SideMenuProvider>
        <LeftNav />
        {children}
      </SideMenuProvider>
    </div>
  );
};

export default Layout;
