import Header from './components/Header';
import Menu from './components/Menu';
import BookingModal from './components/BookingModal';
import RiderTracking from './components/RiderTracking';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { useState } from 'react';

import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import ServiceSelection from './components/ServiceSelection';
import PadalaBooking from './components/PadalaBooking';
import ManualOrderModal from './components/ManualOrderModal';

// Home Page: Select between Food, Pabili, and Padala
function ServiceSelectionPage() {
  const navigate = useNavigate();

  const handleServiceSelect = (service) => {
    switch (service) {
      case 'food':
        navigate('/food');
        break;
      case 'pabili':
        navigate('/pabili');
        break;
      case 'padala':
        navigate('/padala');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-brand-light font-brand">
      <Header />
      <ServiceSelection onServiceSelect={handleServiceSelect} />
    </div>
  );
}

// Food Service Page (Original Daplash Landing Page logic)
const FoodService = ({ onOrder, onOpenManualOrder }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white font-outfit min-h-screen">
      <Header />
      <main>
        <Menu onOrder={onOrder} onOpenManualOrder={onOpenManualOrder} />
      </main>
    </div>
  );
};

// Pabili Service Page
function PabiliService() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <PadalaBooking title="Pabili" mode="simple" onBack={() => navigate('/')} />
    </div>
  );
}

// Padala Service Page
function PadalaService() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <PadalaBooking title="Padala" mode="full" onBack={() => navigate('/')} />
    </div>
  );
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  const handleOrder = (item) => {
    setSelectedService(item);
    setIsModalOpen(true);
  };

  const handleBookingConfirm = (data) => {
    setBookingData(data);
    setIsModalOpen(false);
    // Show tracking for any food order for demo purposes
    setIsTrackingOpen(true);
  };

  return (
    <Router>
      <div className="min-h-screen font-brand bg-brand-light text-brand-charcoal">
        <Routes>
          {/* New 3-Service Landing Page */}
          <Route path="/" element={<ServiceSelectionPage />} />

          {/* The three services */}
          <Route path="/food" element={<FoodService onOrder={handleOrder} onOpenManualOrder={() => setIsManualModalOpen(true)} />} />
          <Route path="/pabili" element={<PabiliService />} />
          <Route path="/padala" element={<PadalaService />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Fix for /food/admin and catch-all */}
          <Route path="/food/admin" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleBookingConfirm}
          service={selectedService}
        />
        <RiderTracking
          isOpen={isTrackingOpen}
          onClose={() => setIsTrackingOpen(false)}
          bookingData={bookingData}
        />
        <ManualOrderModal
          isOpen={isManualModalOpen}
          onClose={() => setIsManualModalOpen(false)}
          onConfirm={(data) => {
            setBookingData({ ...data, itemName: 'Manual Order', isManual: true });
            setIsTrackingOpen(true);
          }}
        />
      </div>
    </Router>
  );
}

export default App;
