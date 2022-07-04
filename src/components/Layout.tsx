import { useEffect, useState } from "react";

const Layout = ({ children }: any) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <div>{children}</div>;
};

export default Layout;
