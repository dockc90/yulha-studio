import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[280px] w-full flex items-center justify-center p-6 bg-[#FBFBFA] rounded-xl border border-[#EDEDEB]">
          <div className="bg-white rounded-xl shadow-sm border border-[#E9E9E7] p-6 max-w-md w-full text-center space-y-4">
            <div className="w-10 h-10 rounded-full bg-[#F1F1EF] text-[#37352F] mx-auto flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#23272A]">
                {this.props.fallbackTitle || '화면을 불러오는 중 일시적인 오류가 발생했습니다'}
              </h3>
              <p className="text-xs text-[#787774] mt-1 leading-relaxed">
                작업 중인 데이터는 안전하게 보존되어 있습니다. 아래 복구 버튼을 눌러 작업을 계속 진행하세요.
              </p>
              {this.state.error?.message && (
                <div className="mt-3 p-2.5 bg-[#F7F6F3] rounded-lg text-[11px] font-mono text-[#787774] text-left truncate border border-[#E9E9E7]">
                  {this.state.error.message}
                </div>
              )}
            </div>
            <div className="flex items-center justify-center space-x-2 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#23272A] hover:bg-[#37352F] text-white font-medium text-xs transition cursor-pointer shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>화면 복구하기</span>
              </button>
              <button
                type="button"
                onClick={this.handleReload}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#F1F1EF] hover:bg-[#EAE9E5] text-[#37352F] font-medium text-xs transition cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>새로고침</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
