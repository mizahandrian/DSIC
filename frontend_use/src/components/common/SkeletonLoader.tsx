// src/components/common/SkeletonLoader.tsx
import React from 'react';

interface SkeletonLoaderProps {
  type?: 'card' | 'table' | 'form' | 'chart' | 'list';
  count?: number;
  height?: number;
  width?: string;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  type = 'card', 
  count = 1,
  height,
  width,
  className = ''
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="skeleton-card">
            <div className="skeleton-avatar" style={{ width: 50, height: 50, borderRadius: '50%' }}></div>
            <div className="skeleton-lines">
              <div className="skeleton-line" style={{ width: '70%' }}></div>
              <div className="skeleton-line" style={{ width: '50%' }}></div>
              <div className="skeleton-line" style={{ width: '40%' }}></div>
            </div>
          </div>
        );
      
      case 'table':
        return (
          <div className="skeleton-table">
            <div className="skeleton-table-header">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="skeleton-line" style={{ width: '100%', height: 20 }}></div>
              ))}
            </div>
            {[...Array(count)].map((_, i) => (
              <div key={i} className="skeleton-table-row">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="skeleton-line" style={{ width: '100%', height: 16 }}></div>
                ))}
              </div>
            ))}
          </div>
        );
      
      case 'form':
        return (
          <div className="skeleton-form">
            {[...Array(count)].map((_, i) => (
              <div key={i} className="skeleton-form-group">
                <div className="skeleton-line" style={{ width: '30%', height: 14, marginBottom: 8 }}></div>
                <div className="skeleton-line" style={{ width: '100%', height: 40, borderRadius: 10 }}></div>
              </div>
            ))}
          </div>
        );
      
      case 'chart':
        return (
          <div className="skeleton-chart">
            <div className="skeleton-line" style={{ width: '40%', height: 20, marginBottom: 20 }}></div>
            <div className="skeleton-chart-bars">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton-chart-bar" style={{ height: Math.random() * 100 + 50 }}></div>
              ))}
            </div>
          </div>
        );
      
      case 'list':
        return (
          <div className="skeleton-list">
            {[...Array(count)].map((_, i) => (
              <div key={i} className="skeleton-list-item">
                <div className="skeleton-avatar" style={{ width: 40, height: 40, borderRadius: '50%' }}></div>
                <div className="skeleton-lines">
                  <div className="skeleton-line" style={{ width: '60%' }}></div>
                  <div className="skeleton-line" style={{ width: '40%' }}></div>
                </div>
              </div>
            ))}
          </div>
        );
      
      default:
        return (
          <div className="skeleton-default" style={{ height: height || 100, width: width || '100%' }}>
            <div className="skeleton-line" style={{ width: '100%', height: '100%' }}></div>
          </div>
        );
    }
  };

  return (
    <div className={`skeleton-wrapper ${className}`}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="skeleton-item">
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;