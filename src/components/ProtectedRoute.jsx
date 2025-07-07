import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectCurrentUser, selectAuthLoading } from '../store/slices/authSlice';

const ProtectedRoute = ({ children }) => {
  const currentUser = useSelector(selectCurrentUser);
  const loading = useSelector(selectAuthLoading);

  // If still loading, show nothing or a loading spinner
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If authenticated, render the children
  return children;
};

export default ProtectedRoute;
