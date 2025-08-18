import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./pages/Header";
import Footer from "./pages/Footer";
import WalletConnectProvider from './providers/WalletProvider';
import CreateToken from './pages/CreateToken';
import CreateLiquidity from './pages/CreateLiquidity';
import ManageLiquidity from './pages/ManageLiquidity';
import Marketing from './pages/Marketing';
import Affiliate from './pages/Affiliate';

export default function App() {
  return (
    <Router>
      <WalletConnectProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex items-center justify-center pt-16 min-h-[100vh] bg-image">
            <Routes>
              <Route path="/" element={<CreateToken />} />
              <Route path="/create-liquidity" element={<CreateLiquidity />} />
              <Route path="/manage-liquidity" element={<ManageLiquidity />} />
              <Route path="/marketing" element={<Marketing />} />
              <Route path="/marketing/:token" element={<Marketing />} />
              <Route path="/affiliate" element={<Affiliate />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </WalletConnectProvider>
    </Router>
  );
}
