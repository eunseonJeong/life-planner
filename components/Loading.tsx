import React from 'react';

interface LoadingStateProps {
  title?: string;
  description?: string;
  progress?: number;
  showProgress?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Loading: React.FC<LoadingStateProps> = ({
  title = '로딩 중입니다...',
  description = '잠시만 기다려주세요.',
  progress,
  showProgress = false,
  className = '',
  children,
}) => {
  return (
    <div className={`w-full h-full flex flex-col items-center justify-center ${className}`}>
      {/* 스피너 */}
      <div className="relative mb-6">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>

      {/* 제목 */}
      <div className="text-blue-600 text-lg font-medium mb-2">{title}</div>

      {/* 진행률 표시 */}
      {showProgress && progress !== undefined && (
        <div className="w-64 bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          ></div>
        </div>
      )}

      {/* 설명 */}
      {description && (
        <div className="text-sm text-gray-500 text-center max-w-md">{description}</div>
      )}

      {/* 추가 컨텐츠 */}
      {children}
    </div>
  );
};