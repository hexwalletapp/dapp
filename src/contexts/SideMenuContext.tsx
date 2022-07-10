import React, { createContext, useState } from "react";

const SideMenuContext = createContext({
  sidebarOpen: false,
  setSidebarOpen: (_: boolean) => {},
});

export const SideMenuProvider = ({ children }: any) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  console.log(sidebarOpen);
  return (
    <SideMenuContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
      }}
    >
      <div>{children}</div>
    </SideMenuContext.Provider>
  );
};

export default SideMenuContext;
