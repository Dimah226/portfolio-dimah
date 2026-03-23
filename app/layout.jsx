import './globals.css';
import { LangProvider } from '@/context/LangContext';
import { AdminProvider } from '@/context/AdminContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import Chatbot from '@/components/Chatbot';
import AdminLoginPortal from '@/components/AdminLoginPortal';
import StairTransition from '@/components/StairTransition';
import PageTransition from '@/components/PageTransition';

export const metadata = {
  title: 'Dimah · Statisticien & Data Scientist',
  description: 'Portfolio de Hamid — Statisticien, Économiste, Actuaire & Data Scientist.',
  keywords: ['statistique', 'économie', 'actuariat', 'data science', 'machine learning'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Jost:wght@300;400;500&family=DM+Mono:ital,wght@0,300;0,400;1,300&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LangProvider>
          {/* ← AdminProvider englobe tout — un seul état partagé */}
          <AdminProvider>
            <CustomCursor />
            <AdminLoginPortal />
            <StairTransition />
            <Header />
            <PageTransition>{children}</PageTransition>
            <Footer />
            <Chatbot />
          </AdminProvider>
        </LangProvider>
      </body>
    </html>
  );
}