import { Navigate, Route, Routes } from 'react-router-dom';
import Instant from './page/instant';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Instant />} />
    <Route path="/*" element={<Navigate to="/" />} />
  </Routes>
);

export default AppRoutes;
