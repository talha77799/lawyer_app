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
import CaseTracker from './pages/CaseTracker'

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
        <Route path="/cases" element={<CaseTracker />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
