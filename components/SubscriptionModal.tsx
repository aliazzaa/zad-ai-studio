
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import { SUBSCRIPTION_PLANS } from '../constants';

const SubscriptionModal: React.FC = () => {
    const { isSubscriptionModalOpen, closeSubscriptionModal, upgradePlan, redeemCoupon, user } = useAppContext();
    const { t } = useLanguage();
    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState(false);

    if (!isSubscriptionModalOpen) return null;

    const handleRedeem = () => {
        if (redeemCoupon(couponCode)) {
            setCouponSuccess(true);
            setCouponError('');
            setTimeout(() => {
                closeSubscriptionModal();
                setCouponSuccess(false);
                setCouponCode('');
            }, 1500);
        } else {
            setCouponError(t('subscription.couponInvalid'));
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-4">
            <div className="w-full max-w-5xl bg-slate-50 dark:bg-slate-900 rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-8 text-center bg-gradient-to-b from-teal-900 to-slate-900 text-white">
                    <button onClick={closeSubscriptionModal} className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <h2 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-cyan-200">
                        {t('subscription.title')}
                    </h2>
                    <p className="text-teal-200/80 max-w-2xl mx-auto">
                        {t('subscription.subtitle')}
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {SUBSCRIPTION_PLANS.map((plan) => {
                            const isCurrent = user?.plan === plan.id;
                            return (
                                <div key={plan.id} className={`relative flex flex-col p-6 rounded-2xl transition-transform hover:scale-[1.02] border-2 ${plan.isPopular ? 'border-teal-500 bg-white dark:bg-slate-800 shadow-xl' : 'border-gray-200 bg-gray-50 dark:bg-slate-800/50 dark:border-slate-700'}`}>
                                    {plan.isPopular && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-teal-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                                            {t('subscription.mostPopular')}
                                        </div>
                                    )}
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white text-center mb-2">{t(plan.titleKey)}</h3>
                                    <div className="text-3xl font-extrabold text-center text-teal-700 dark:text-teal-400 mb-4">{t(plan.priceKey)}</div>
                                    <p className="text-sm text-gray-500 dark:text-slate-400 text-center mb-6 h-10">{t(plan.descriptionKey)}</p>
                                    
                                    <ul className="space-y-3 mb-8 flex-grow">
                                        {plan.featuresKey.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-slate-300">
                                                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                {t(feature)}
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        onClick={() => upgradePlan(plan.id)}
                                        disabled={isCurrent}
                                        className={`w-full py-3 rounded-xl font-bold transition-all ${isCurrent 
                                            ? 'bg-gray-200 text-gray-500 cursor-default dark:bg-slate-700 dark:text-slate-400' 
                                            : plan.isPopular 
                                                ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-lg hover:shadow-xl' 
                                                : 'bg-white border-2 border-teal-600 text-teal-700 hover:bg-teal-50 dark:bg-transparent dark:text-teal-400 dark:border-teal-500 dark:hover:bg-teal-900/20'}`}
                                    >
                                        {isCurrent ? t('subscription.currentPlan') : t(plan.buttonKey)}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Enterprise / Partner Section */}
                    <div className="mt-8 max-w-2xl mx-auto p-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl text-center">
                        <h4 className="text-lg font-bold text-indigo-900 dark:text-indigo-200 mb-2">{t('subscription.enterprise.title')}</h4>
                        <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-4">{t('subscription.enterprise.desc')}</p>
                        
                        <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                            <input 
                                type="text" 
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                placeholder={t('subscription.couponPlaceholder')}
                                className="flex-grow p-3 rounded-lg border border-indigo-300 focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-indigo-700 dark:text-white"
                            />
                            <button 
                                onClick={handleRedeem}
                                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                            >
                                {t('subscription.redeem')}
                            </button>
                        </div>
                        {couponError && <p className="text-red-500 text-sm mt-2">{couponError}</p>}
                        {couponSuccess && <p className="text-green-600 font-bold text-sm mt-2">🎉 {t('subscription.couponSuccess')}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionModal;
