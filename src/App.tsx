import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignInCard from "./component/signInSlider";
import Dashboard from "./pages/dashboard";
import { SnackbarProvider } from './component/SnackbarContext';
import './App.css';

export default function App() {
  return (
    <SnackbarProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<SignInCard />} />
          <Route path="/register" element={<SignInCard />} />
          <Route path="/dashboard/:email" element={<Dashboard />} />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}