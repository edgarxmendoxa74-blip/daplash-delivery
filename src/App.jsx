import Header from './components/Header';
import Hero from './components/Hero';
import Menu from './components/Menu';
import FAQ from './components/FAQ';
import BookingModal from './components/BookingModal';
import RiderTracking from './components/RiderTracking';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { useState } from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const LandingPage = ({ onOrder }) => (
  <>
    <Header />
    <main>
      <Menu onOrder={onOrder} />
      <Hero />
      <FAQ />
    </main>
  </>
);

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingData, setBookingData] = useState(null);

  const handleOrder = (item) => {
    setSelectedService(item); // Keeping variable names similar for now or refactor to selectedItem
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
      <div className="min-h-screen bg-white font-outfit">
        <Routes>
          <Route path="/" element={<LandingPage onOrder={handleOrder} />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
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
      </div>
    </Router>
  );
}

export default App;
