import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  //   const user = {
  //     name: "Dayana",
  //   };
  function login(userData) {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }
  function logout() {
    setUser(null);
    localStorage.removeItem("user");
  }
  function loadUser() {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user);
    }
  }
  useEffect(() => {
    loadUser();
  }, []);
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}
export default AuthProvider;
export { AuthContext };
