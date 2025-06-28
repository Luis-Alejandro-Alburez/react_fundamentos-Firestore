import { createContext, useState } from "react";


export const StoreContext = createContext();

export const StoreContextProvider = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <StoreContext.Provider value={{
      isLoggedIn,
      setIsLoggedIn
    }}>
      {children}
    </StoreContext.Provider>
  )
}