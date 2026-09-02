import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { ToastContainer } from './components/common/ToastContainer';
import { HomeRoleSelector } from './components/home/HomeRoleSelector';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StaffDashboard } from './components/staff/StaffDashboard';
import { ParentDashboard } from './components/parent/ParentDashboard';

const MainContent: React.FC = () => {
  const { currentRole } = useApp();

  return (
    <div className="min-h-screen bg-[#F0F5F9] text-slate-800 flex flex-col antialiased selection:bg-blue-500 selection:text-white">
      {/* App Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-6 pb-24 lg:pb-8 flex flex-col">
        {!currentRole && <HomeRoleSelector />}
        {currentRole === 'admin' && <AdminDashboard />}
        {currentRole === 'staff' && <StaffDashboard />}
        {currentRole === 'parent' && <ParentDashboard />}
      </main>

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Mobile / Tablet Bottom Navigation */}
      <BottomNav />

      {/* Connectivity Banner */}
      <OfflineIndicator />

      {/* Realtime Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
