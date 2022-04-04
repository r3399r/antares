import { Navigate, Route, Routes } from 'react-router-dom';
import { Page } from './constant/Page';
import Instant from './page/instant/Instant';
import Landing from './page/landing/Landing';
import Lottery from './page/lottery/Lottery';

const AppRoutes = () => (
  <Routes>
    <Route path={Page.Landing} element={<Landing />} />
    <Route path={Page.Lottery} element={<Lottery />} />
    <Route path={Page.Instant} element={<Instant />} />
    <Route path="/*" element={<Navigate to={Page.Landing} />} />
  </Routes>
);

export default AppRoutes;
