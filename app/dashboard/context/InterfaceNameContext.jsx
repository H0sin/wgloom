"use client";
import { createContext, useState } from "react";

const InterfaceNameContext = createContext();

export const InterfaceNameProvider = ({ children }) => {
  const [interfaceName, setInterfaceName] = useState();

  return (
    <InterfaceNameContext.Provider value={{ interfaceName, setInterfaceName }}>
      {children}
    </InterfaceNameContext.Provider>
  );
};

export default InterfaceNameContext;
