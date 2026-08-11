import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. گرفتن کاربر فعلی هنگام لود شدن برنامه
    async function getCurrentUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.log("Get user error:", error);
        return;
      }

      setUser(user);
    }
    console.log("AUTH PROVIDER MOUNT");
    getCurrentUser();

    // 2. گوش دادن به تغییرات وضعیت احراز هویت
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // 3. cleanup
    return () => {
      console.log("AUTH PROVIDER CLEANUP");
      subscription.unsubscribe();
    };
  }, []);
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
