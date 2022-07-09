import { useEffect, useState } from "react";
import Meta from "~/components/Meta";
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
      {children}
    </div>
  );
};

export default Layout;
