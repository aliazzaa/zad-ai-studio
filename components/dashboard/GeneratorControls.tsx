
import React, { useState } from 'react';
import { CONTENT_TYPE_GROUPS, CONTENT_TYPE_DETAILS, EDUCATIONAL_LEVELS } from '../../constants';
import { useAppContext } from '../../contexts/AppContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ContentType } from '../../types';
import TabButton from '../TabButton';

const GeneratorControls: React.FC = () => {
    const { generateContent, openScheduleModal, isLoading, contentType } = useAppContext();
    const { t } = useLanguage();
    const [customPrompts, setCustomPrompts] = useState<{ [key in ContentType]?: string }>({});
    const [educationalLevels, setEducationalLevels] = useState<{ [key in ContentType]?: string }>({
        [ContentType.EducationalVideoScript]: EDUCATIONAL_LEVELS[1].value // Default to elementary
    });
    
    // State for active tab, defaulting to the first group
    const [activeGroupKey, setActiveGroupKey] = useState(CONTENT_TYPE_GROUPS[0].titleKey);

    const handlePromptChange = (type: ContentType, value: string) => {
        setCustomPrompts(prev => ({ ...prev, [type]: value }));
    };

    const handleLevelChange = (type: ContentType, value: string) => {
        setEducationalLevels(prev => ({ ...prev, [type]: value }));
    };

    const activeGroup = CONTENT_TYPE_GROUPS.find(g => g.titleKey === activeGroupKey);

    return (
        <div className="p-2 space-y-6">
            <h2 className="text-xl font-bold text-center text-teal-800 dark:text-teal-300">{t('generatorControls.title')}</h2>
            
            {/* Tab navigation */}
            <div className="flex flex-wrap items-center justify-center -mb-px gap-x-2 gap-y-1">
                {CONTENT_TYPE_GROUPS.map((group) => (
                    <TabButton
                        key={group.titleKey}
                        label={t(group.titleKey)}
                        isActive={activeGroupKey === group.titleKey}
                        onClick={() => setActiveGroupKey(group.titleKey)}
                    />
                ))}
            </div>
            
            {/* Content for the active tab */}
            <div className="grid grid-cols-1 gap-3 pt-6 border-t border-gray-200 animate-fade-in dark:border-slate-700">
                {activeGroup && activeGroup.types.map((type) => {
                    const label = t(CONTENT_TYPE_DETAILS[type].labelKey);
                    const isCurrentLoading = isLoading && contentType === type;
                    return (
                        <div key={type} className="flex flex-col w-full p-3 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-slate-700 dark:border-slate-600">
                            <div className="flex items-center">
                                <div className="flex-grow my-auto text-start">
                                    <p className="font-semibold text-gray-800 dark:text-slate-200">{label}</p>
                                </div>
                                <div className="flex items-center flex-shrink-0 ltr:border-l rtl:border-r border-gray-200 ltr:pl-3 rtl:pr-3 ltr:ml-3 rtl:mr-3 dark:border-slate-500">
                                    <button
                                        onClick={() => openScheduleModal(type)}
                                        title={t('generatorControls.scheduleTooltip', { label })}
                                        disabled={isLoading}
                                        className="p-2 text-gray-500 transition-colors duration-200 rounded-full hover:bg-gray-200 hover:text-gray-800 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-600 dark:hover:text-slate-100"
                                    >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                                    </button>
                                    <button
                                        className="px-4 py-2 ml-2 text-sm font-bold text-white transition-colors duration-200 bg-teal-600 rounded-md shadow-sm hover:bg-teal-700 disabled:bg-teal-400 dark:bg-teal-500 dark:hover:bg-teal-600 dark:disabled:bg-teal-800"
                                        onClick={() => {
                                            let finalPrompt = customPrompts[type];
                                            if (type === ContentType.EducationalVideoScript) {
                                                const topic = customPrompts[type] || '';
                                                const levelValue = educationalLevels[type] || EDUCATIONAL_LEVELS[1].value;
                                                const levelLabel = t(EDUCATIONAL_LEVELS.find(l => l.value === levelValue)?.labelKey || '');
                                                // Construct a structured prompt
                                                finalPrompt = `الموضوع: ${topic}\nالمرحلة الدراسية: ${levelLabel}`;
                                            }
                                            generateContent(type, finalPrompt);
                                        }}
                                        disabled={isLoading}
                                    >
                                        {isCurrentLoading ? t('global.loading') : t('generatorControls.generateTooltip')}
                                    </button>
                                </div>
                            </div>
                            <div className="mt-2 space-y-2">
                                <input
                                    type="text"
                                    placeholder={t('generatorControls.customTopicPlaceholder')}
                                    value={customPrompts[type] || ''}
                                    onChange={(e) => handlePromptChange(type, e.target.value)}
                                    className="w-full p-2 text-sm bg-slate-50 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-800 dark:border-slate-500 dark:text-white dark:placeholder-slate-400"
                                    disabled={isLoading}
                                />
                                {type === ContentType.EducationalVideoScript && (
                                    <div className="flex items-center gap-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-slate-300 whitespace-nowrap">{t('generatorControls.learningYearLabel')}</label>
                                        <select
                                            value={educationalLevels[type] || ''}
                                            onChange={(e) => handleLevelChange(type, e.target.value)}
                                            className="w-full p-2 text-sm bg-slate-50 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-800 dark:border-slate-500 dark:text-white"
                                            disabled={isLoading}
                                        >
                                            {EDUCATIONAL_LEVELS.map(level => (
                                                <option key={level.value} value={level.value}>{t(level.labelKey)}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default GeneratorControls;