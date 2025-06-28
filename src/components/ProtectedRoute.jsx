import { Navigate, Outlet } from 'react-router-dom';
import { CommonConstants } from '../../utils/commonConstants';


export default function ProtectedRoute() {

  // Revisa si el usuario está autenticado
  const userEmail = localStorage.getItem(CommonConstants.USER_INFO_STORAGE)
  if (!userEmail) {
    return <Navigate to="/" />;
  }

  // Outlet tiene los componentes que están dentro de Route
  return <Outlet />;
}