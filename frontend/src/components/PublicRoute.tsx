import { Navigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { useAppSelector } from "@/store/hooks";

export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { authUser, isCheckingAuth } = useAppSelector((state) => state.auth);

    if (isCheckingAuth) {
      return <LoadingSpinner />;
    }

    return authUser ? <Navigate to="/dashboard" replace /> : <>{children}</>;
  };