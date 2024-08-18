// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/SignUp';
import LoginForm from './components/Login';
import Navigation from './components/Navigation';
import PrincipalDashboard from "./components/PrincipalDashboard"

function App() {
  return (
    <Router>
      <div className='flex w-[100vw] flex-col min-h-screen'>
        <Navigation />
        <main className="flex w-full flex-1 items-center justify-center p-4">
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/principal-dashboard" element={<PrincipalDashboard></PrincipalDashboard>} />

            <Route path="/" element={<h1>Welcome to the App!</h1>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
