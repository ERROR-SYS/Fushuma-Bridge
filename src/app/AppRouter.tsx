import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastListener } from '~/app/contexts/ToastsContext';
import '../styles/app.css';
import Spinner from './components/common/Spinner';
import CookiesBar from './components/CookiesBar';
import { Footer, Header } from './layout';

const Home = lazy(() => import('./pages/home'));
const Network = lazy(() => import('./pages/Network'));
const TokenList = lazy(() => import('./pages/TokenList'));
const Swap = lazy(() => import('./pages/Swap'));
const Transfer = lazy(() => import('./pages/Transfer'));
const PreviousClaim = lazy(() => import('./pages/PreviousClaim'));
const SelectMethod = lazy(() => import('./pages/SelectMethod'));

export default function AppRouter() {
  window.ethereum?.removeAllListeners(['networkChanged']);

  const LoadingMessage = () => (
    <div className="loading">
      <Spinner size="lg"></Spinner>
    </div>
  );

  return (
    <BrowserRouter>
      <Header />
      <Suspense fallback={<LoadingMessage />}>
        <CookiesBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/select" element={<SelectMethod />} />
          <Route path="/network" element={<Network />} />
          <Route path="/tokens" element={<TokenList />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/previousclaim" element={<PreviousClaim />} />
        </Routes>
      </Suspense>
      <ToastListener />
      <Footer />
    </BrowserRouter>
  );
}
