import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Lawyers from './pages/Lawyers'
import LawyerProfile from './pages/LawyerProfile'
import ClientDashboard from './pages/ClientDashboard'
import LawyerDashboard from './pages/LawyerDashboard'
import CalendarPage from './pages/CalendarPage'
import BookAppointment from './pages/BookAppointment'
import JoinAsLawyer from './pages/JoinAsLawyer'
import Login from './pages/Login'
import Signup from './pages/Signup'
import SignupOtp from './pages/SignupOtp'
import CaseTracker from './pages/CaseTracker'
import Availability from './pages/Availability'
import WalletPayouts from './pages/WalletPayouts'
import Reviews from './pages/Reviews'
import MyProfile from './pages/MyProfile'
import Payments from './pages/Payments'
import DownloadApp from './pages/DownloadApp'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lawyers" element={<Lawyers />} />
        <Route path="/lawyers/:id" element={<LawyerProfile />} />
        <Route path="/dashboard" element={<ClientDashboard />} />
        <Route path="/lawyer-dashboard" element={<LawyerDashboard />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/book/:id" element={<BookAppointment />} />
        <Route path="/join-as-lawyer" element={<JoinAsLawyer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/otp" element={<SignupOtp />} />
        <Route path="/cases" element={<CaseTracker />} />
        <Route path="/lawyer/availability" element={<Availability />} />
        <Route path="/lawyer/wallet" element={<WalletPayouts />} />
        <Route path="/lawyer/reviews" element={<Reviews />} />
        <Route path="/lawyer/profile" element={<MyProfile />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/download-app" element={<DownloadApp />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
