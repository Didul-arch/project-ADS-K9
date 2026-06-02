import React, { createContext, useState, useContext, useEffect } from "react";
import { apiJson } from "../lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user session exists in localStorage
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false);

    // Automatically log out when API returns 401
    const handleUnauthorized = () => {
      console.warn("Session expired or unauthorized. Logging out...");
      logout();
    };

    window.addEventListener("auth-unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth-unauthorized", handleUnauthorized);
    };
  }, []);

  const login = async (email, password) => {
    try {
      const params = new URLSearchParams();
      params.append("username", email.trim());
      params.append("password", password);
      const tokenRes = await apiJson("/token", {
        method: "POST",
        body: params,
      });

      if (!tokenRes.ok || !tokenRes.data) return false;

      const tokenData = tokenRes.data;
      const token = tokenData.access_token;
      setToken(token);
      localStorage.setItem("token", token);

      // Fetch user profile info
      const meResponse = await apiJson("/users/me", { token });

      if (!meResponse.ok || !meResponse.data) {
        logout();
        return false;
      }

      const dbUser = meResponse.data;

      // Map backend role enum to frontend roles:
      // Backend: 'admin', 'civitas', 'umum'
      // Frontend expects: 'Admin', 'Student'
      const mappedRole = dbUser.role === "admin" ? "Admin" : "Student";

      const userData = {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.fullname,
        role: mappedRole,
        nim: dbUser.identity_number,
        department:
          dbUser.role === "admin"
            ? "Direktorat Sistem Informasi"
            : "Ilmu Komputer",
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const signUp = async (
    name,
    email,
    password,
    phoneNumber,
    identityNumber = null,
    identityDocumentFile = null,
  ) => {
    try {
      // Backend CreateUserRequest expects JSON fields. If user provided a file,
      // we include only the filename in `identity_document` (server doesn't accept multipart here).
      const payload = {
        email: email.trim(),
        fullname: name,
        password,
        phone_number: phoneNumber.trim(),
        identity_number: identityNumber || null,
        identity_document: identityDocumentFile
          ? identityDocumentFile.name
          : null,
      };

      const res = await apiJson("/users/", { method: "POST", body: payload });

      if (!res.ok) {
        // Extract error message from backend response
        const errorMsg =
          res.data?.detail ||
          res.data?.message ||
          "Registration failed. Please try again.";
        return { success: false, error: errorMsg };
      }

      // Automatically log the user in after successful sign up
      const loginSuccess = await login(email, password);
      if (loginSuccess) {
        return { success: true, error: null };
      } else {
        return {
          success: false,
          error: "Registration successful but login failed. Please try again.",
        };
      }
    } catch (error) {
      console.error("SignUp error:", error);
      return {
        success: false,
        error:
          error.message || "An unexpected error occurred. Please try again.",
      };
    }
  };

  // Backward compatible stub
  const switchRole = () => {};

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, signUp, switchRole, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
