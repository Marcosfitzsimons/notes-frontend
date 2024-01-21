import useAuth from "@/hooks/use-auth";
import { ReactElement } from "react";
import { Navigate } from "react-router-dom";

type ProtectedRoutesProps = {
  children: ReactElement;
};

const ProtectedRoute = ({ children }: ProtectedRoutesProps) => {
  const { auth } = useAuth();
  const user = auth?.user;
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
