import { createContext } from "react";

const AuthContext = createContext();

function AuthProvider({children}) {
    const user = {
   name: "Dayana"
}
    return (
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
export  {AuthContext}
