import { useSelector } from "react-redux";
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  console.log("useruser-", user);
  console.log("isAuthenticated-----", isAuthenticated);
  if (!isAuthenticated) {
    window.location.href = "/login";
  }

  if (requiredRole && user.role !== requiredRole) {
    // window.location.href = "/";
  }

  return children;
};
export default ProtectedRoute;
