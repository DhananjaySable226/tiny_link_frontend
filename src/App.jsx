import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import StatsPage from './components/StatsPage';
import RedirectHandler from './components/RedirectHandler';
import Header from './components/Header';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/code/:code" element={<StatsPage />} />
            <Route path="/:code" element={<RedirectHandler />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;