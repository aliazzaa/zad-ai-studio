import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-slate-50 dark:bg-slate-900">
          <div className="max-w-md p-8 bg-white border border-red-100 rounded-2xl shadow-xl dark:bg-slate-800 dark:border-red-900/30">
            <div className="flex justify-center mb-6">
                <div className="p-4 bg-red-50 rounded-full dark:bg-red-900/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
            </div>
            <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">عذراً، حدث خطأ غير متوقع</h1>
            <p className="mb-6 text-gray-600 dark:text-slate-300">
              لمنع توقف العمل وفقدان البيانات، قام النظام بإيقاف العملية الحالية. يرجى تحديث الصفحة للمتابعة.
              <br/>
              <span className="text-xs opacity-70 mt-2 block dir-ltr">{this.state.error?.message}</span>
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 font-bold text-white transition-transform transform bg-teal-600 rounded-xl hover:bg-teal-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-300"
            >
              تحديث الصفحة واستعادة العمل
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

export default ErrorBoundary;