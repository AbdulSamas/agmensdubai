import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer, FloatingWhatsApp, PurchaseNotification } from './FloatingElements';

export function MainLayout() {
  return (
    <>
      <Header />
      <CartDrawer />
      <FloatingWhatsApp />
      <PurchaseNotification />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
