import React from 'react';
import { Button } from '@/components/ui/button';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const Empty: React.FC<EmptyStateProps> = ({
  icon,
  title = '데이터가 없습니다',
  description,
  actionLabel,
  onAction,
  className = '',
  children,
}) => {
  return (
    <div className={`w-full flex flex-col items-center justify-center py-12 ${className}`}>
      {/* 아이콘 */}
      <div className="text-gray-400 mb-4">
        {icon || <Inbox className="h-12 w-12" />}
      </div>

      {/* 제목 */}
      <div className="text-gray-600 dark:text-gray-400 text-lg font-medium mb-2 text-center">
        {title}
      </div>

      {/* 설명 */}
      {description && (
        <div className="text-sm text-gray-500 dark:text-gray-500 text-center max-w-md mb-4">
          {description}
        </div>
      )}

      {/* 액션 버튼 */}
      {actionLabel && onAction && (
        <Button variant="link" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}

      {/* 추가 컨텐츠 */}
      {children}
    </div>
  );
};

