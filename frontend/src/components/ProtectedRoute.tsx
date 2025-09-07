import { useAppSelector } from "@/store/hooks";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { authUser, isCheckingAuth } = useAppSelector((state) => state.auth);

    if (isCheckingAuth) {
      return <LoadingSpinner />;
    }

    return authUser ? <>{children}</> : <Navigate to="/login" replace />;
  };