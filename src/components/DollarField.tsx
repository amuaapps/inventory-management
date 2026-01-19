'use client';

import React from 'react';
import { useField } from '@payloadcms/ui';

type DollarFieldProps = {
  path: string;
  required?: boolean;
  label?: string;
  admin?: {
    description?: string;
  };
};

export const DollarField: React.FC<DollarFieldProps> = (props) => {
  const { value, setValue } = useField<number>({ path: props.path });

  // Convert cents to dollars for display
  const dollarValue = value != null ? (value / 100).toFixed(2) : '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty input
    if (inputValue === '') {
      setValue(0);
      return;
    }

    // Parse dollar value and convert to cents
    const dollars = parseFloat(inputValue);
    if (!isNaN(dollars)) {
      const cents = Math.round(dollars * 100);
      setValue(cents);
    }
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label
        style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: 600,
          fontSize: '0.875rem',
        }}
      >
        {props.label || props.path}
        {props.required && <span style={{ color: '#ef4444' }}> *</span>}
      </label>
      {props.admin?.description && (
        <p
          style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '0.5rem',
          }}
        >
          {props.admin.description}
        </p>
      )}
      <div style={{ position: 'relative' }}>
        <span
          style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#6b7280',
            fontWeight: 500,
          }}
        >
          $
        </span>
        <input
          type="number"
          step="0.01"
          min="0"
          value={dollarValue}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem 0.5rem 1.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
          }}
          placeholder="0.00"
        />
      </div>
    </div>
  );
};
