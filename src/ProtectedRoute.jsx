import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, userAuthed }) => {
  return userAuthed ? <Component /> : <Navigate to="/" />;
};

export default ProtectedRoute;
