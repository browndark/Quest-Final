import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Alert from './components/common/Alert';
import ApiDebugTool from './components/common/ApiDebugTool';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieDetail from './pages/MovieDetail';
import SeatSelection from './pages/SeatSelection';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ApiDiagnostics from './pages/ApiDiagnostics';
import MyReservations from './pages/MyReservations';

// Context providers
import AuthProvider from './context/AuthContext';
import AlertProvider from './context/AlertContext';

// Commented out imports for components that don't exist yet
/*
// Admin pages
import AdminDashboard from './pages/Admin/Dashboard';
import MovieManagement from './pages/Admin/MovieManagement';
import TheaterManagement from './pages/Admin/TheaterManagement';
import SessionManagement from './pages/Admin/SessionManagement';
import ReservationManagement from './pages/Admin/ReservationManagement';
*/

const App = () => {
  return (
    <AuthProvider>
      <AlertProvider>        <Router>
          <Header />
          <Alert />
          <ApiDebugTool />
          <main className="container">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />              <Route path="/movies/:id" element={<MovieDetail />} />
              <Route path="/sessions/:id" element={<SeatSelection />} />
              <Route path="/api-diagnostics" element={<ApiDiagnostics />} />
              {/* Protected Routes */}          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reservations" element={<MyReservations />} />
          
          {/* Admin Routes - Temporarily commented out until components are created */}
          {/*
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/movies" element={<MovieManagement />} />
          <Route path="/admin/theaters" element={<TheaterManagement />} />
          <Route path="/admin/sessions" element={<SessionManagement />} />
          <Route path="/admin/reservations" element={<ReservationManagement />} />
          */}
          
              {/* Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </AlertProvider>
    </AuthProvider>
  );
};

export default App;
