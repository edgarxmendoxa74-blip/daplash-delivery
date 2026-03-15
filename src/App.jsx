import Header from './components/Header';
import Menu from './components/Menu';
import BookingModal from './components/BookingModal';
import RiderTracking from './components/RiderTracking';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { useState, Component } from 'react';
import React from 'react';

import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import ServiceSelection from './components/ServiceSelection';
import PadalaBooking from './components/PadalaBooking';
import PasakayBooking from './components/PasakayBooking';
import ManualOrderModal from './components/ManualOrderModal';
import BillPayment from './components/BillPayment';
import CustomOrder from './components/CustomOrder';
import JoinTeam from './components/JoinTeam';
import { useParams } from 'react-router-dom';

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
      case 'pasakay':
        navigate('/pasakay');
        break;
      case 'paybills':
        navigate('/paybills');
        break;
      case 'custom_order':
        navigate('/custom-order');
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
  const { storeId } = useParams();

  if (storeId) {
    return (
      <div className="bg-white font-outfit min-h-screen">
        <Header />
        <main>
          <Menu
            onOrder={onOrder}
            onOpenManualOrder={onOpenManualOrder}
            storeId={storeId}
            onBackToStores={() => navigate('/food')}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="bg-white font-outfit min-h-screen">
      <Header />
      <main>
        <StoreSelection
          onStoreSelect={(id) => navigate(`/food/${id}`)}
          onBack={() => navigate('/')}
        />
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

// Pasakay Service Page
function PasakayService() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <PasakayBooking onBack={() => navigate('/')} />
    </div>
  );
}

// PayBills Service Page
function PayBillsService() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BillPayment onBack={() => navigate('/')} />
    </div>
  );
}

// Custom Order Service Page
function CustomOrderService() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CustomOrder onBack={() => navigate('/')} />
    </div>
  );
}

// Join Team Page
function JoinTeamPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <JoinTeam onBack={() => navigate('/')} />
    </div>
  );
}

// Simple Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white p-6 text-center">
          <div>
            <h1 className="text-4xl font-black text-brand-charcoal mb-4 uppercase">Oops! Something went wrong.</h1>
            <p className="text-gray-500 mb-8 font-medium italic">We're sorry for the inconvenience. Please try refreshing the page.</p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-8 py-3 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest shadow-lg hover:bg-green-700 transition-all"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
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
        <ErrorBoundary>
          <Routes>
            {/* New 3-Service Landing Page */}
            <Route path="/" element={<ServiceSelectionPage />} />

            {/* The three services */}
            <Route path="/food" element={<FoodService onOrder={handleOrder} onOpenManualOrder={() => setIsManualModalOpen(true)} />} />
            <Route path="/food/:storeId" element={<FoodService onOrder={handleOrder} onOpenManualOrder={() => setIsManualModalOpen(true)} />} />
            <Route path="/pabili" element={<PabiliService />} />
            <Route path="/padala" element={<PadalaService />} />
            <Route path="/pasakay" element={<PasakayService />} />
            <Route path="/paybills" element={<PayBillsService />} />
            <Route path="/custom-order" element={<CustomOrderService />} />
            <Route path="/join-team" element={<JoinTeamPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Fix for /food/admin and catch-all */}
            <Route path="/food/admin" element={<Navigate to="/admin" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>

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
