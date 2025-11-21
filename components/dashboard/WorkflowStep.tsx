
import React from 'react';

interface WorkflowStepProps {
    number: number;
    title: string;
    children: React.ReactNode;
    isComplete: boolean;
    isDisabled?: boolean;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({ number, title, children, isComplete, isDisabled }) => (
    <div className={`p-4 border-l-4 transition-all duration-300 ${isComplete ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-teal-500 dark:border-teal-600'} ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
        <h4 className="flex items-center text-lg font-bold text-teal-800 dark:text-teal-300">
            <span className={`flex items-center justify-center w-8 h-8 text-white rounded-full ltr:mr-4 rtl:ml-4 ${isComplete ? 'bg-green-500' : 'bg-teal-600'}`}>
                {isComplete ? '✓' : number}
            </span>
            {title}
        </h4>
        <div className="mt-3 ltr:pl-12 rtl:pr-12 space-y-4">{children}</div>
    </div>
);

export default WorkflowStep;