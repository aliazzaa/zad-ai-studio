




import React from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import UnifiedDashboard from './components/dashboard/UnifiedDashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import ScheduleModal from './components/ScheduleModal';
import LoginModal from './components/LoginModal';
import FeedbackModal from './components/FeedbackModal';
import DeployModal from './components/DeployModal';
import TutorialModal from './components/TutorialModal';
import DocumentationModal from './components/DocumentationModal';
import WelcomeScreen from './components/WelcomeScreen';
import { useLanguage } from './contexts/LanguageContext';
import StudioManager from './components/StudioManager';
import SchedulerManager from './components/SchedulerManager';
import LiveStreamManager from './components/LiveStreamManager';
import Dashboard from './components/dashboard/Dashboard';
import CommunityGallery from './components/CommunityGallery';
import Marketplace from './components/Marketplace';
import SubscriptionModal from './components/SubscriptionModal';
import InstallGuideModal from './components/InstallGuideModal';

const AppContent: React.FC = () => {
    const { language } = useLanguage();
    const { isWelcomeScreenVisible, activePanel } = useAppContext();

    if (isWelcomeScreenVisible) {
        return <WelcomeScreen />;
    }

    const renderActivePanel = () => {
        switch(activePanel) {
            case 'studio':
                return <StudioManager />;
            case 'scheduler':
                return <SchedulerManager />;
            case 'live':
                return <LiveStreamManager />;
            case 'community':
                return <CommunityGallery />;
            case 'marketplace':
                return <Marketplace />;
            case 'generator':
            case 'hadithLibrary':
            case 'quranLibrary':
            case 'backgroundLibrary':
                return <UnifiedDashboard />;
            case 'dashboard':
            default:
                return <Dashboard />;
        }
    }

    return (
        <div className={`min-h-screen flex flex-col ${language === 'ar' ? 'rtl' : 'ltr'}`}>
            <Header />
            <main className="flex-grow container p-4 mx-auto md:p-8">
                 {renderActivePanel()}
            </main>
            <Footer />
            {/* Modals are controlled via context but rendered here for stacking context */}
            <ScheduleModal />
            <LoginModal />
            <FeedbackModal />
            <DeployModal />
            <TutorialModal />
            <DocumentationModal />
            <SubscriptionModal />
            <InstallGuideModal />
        </div>
    );
};


const App: React.FC = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;
