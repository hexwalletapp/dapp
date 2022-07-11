import { useEffect, useState } from "react";
import Meta from "~/components/Meta";
import LeftNav from "~/components/ui/LeftNav";
const Layout = ({ children }: any) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="drawer drawer-mobile">
      <input id="hwa-drawer" type="checkbox" className="drawer-toggle" />
      <Meta />
      <div className="drawer-content">{children}</div>
      <LeftNav />
    </div>
  );
};

export default Layout;
