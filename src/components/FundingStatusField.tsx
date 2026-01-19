'use client';

import React from 'react';

type FundingStatusFieldProps = {
  value?: string;
};

export const FundingStatusField: React.FC<FundingStatusFieldProps> = ({ value }) => {
  if (!value) return null;

  const isError = value.includes('🔴') || value.includes('ERROR');
  const isWarning = value.includes('⚠️') || value.includes('WARNING');
  const isSuccess = value.includes('✅');

  let backgroundColor = '#f3f4f6';
  let textColor = '#6b7280';
  let borderColor = '#e5e7eb';

  if (isError) {
    backgroundColor = '#fee2e2';
    textColor = '#dc2626';
    borderColor = '#fca5a5';
  } else if (isWarning) {
    backgroundColor = '#fef3c7';
    textColor = '#f59e0b';
    borderColor = '#fde68a';
  } else if (isSuccess) {
    backgroundColor = '#dcfce7';
    textColor = '#16a34a';
    borderColor = '#86efac';
  }

  return (
    <div
      style={{
        padding: '0.75rem',
        borderRadius: '0.375rem',
        fontSize: '0.875rem',
        fontWeight: 600,
        backgroundColor,
        color: textColor,
        border: `1px solid ${borderColor}`,
      }}
    >
      {value}
    </div>
  );
};

export default FundingStatusField;
