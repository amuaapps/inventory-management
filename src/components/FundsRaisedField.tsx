'use client';

import React from 'react';
import { useFormFields } from '@payloadcms/ui';
import { NumberField } from '@payloadcms/ui';

export const FundsRaisedField: React.FC<any> = (props) => {
  const { value: fundsNeeded } = useFormFields(([fields]) => fields.fundsNeeded);
  const { value: fundsRaised } = useFormFields(([fields]) => fields.fundsRaised);

  const fundsNeededValue = typeof fundsNeeded === 'number' ? fundsNeeded : 0;
  const fundsRaisedValue = typeof fundsRaised === 'number' ? fundsRaised : 0;
  const remaining = fundsNeededValue - fundsRaisedValue;

  let message = null;
  let messageStyle: React.CSSProperties = {};

  if (remaining < 0) {
    message = '✅ All funds raised';
    messageStyle = {
      color: '#16a34a',
      fontWeight: 600,
      marginTop: '0.5rem',
      fontSize: '0.875rem',
    };
  } else if (remaining < 5000) {
    // Less than $50 remaining
    message = '⚠️ Almost all funds raised';
    messageStyle = {
      color: '#f59e0b',
      fontWeight: 600,
      marginTop: '0.5rem',
      fontSize: '0.875rem',
    };
  }

  return (
    <div>
      <NumberField {...props} />
      {message && <div style={messageStyle}>{message}</div>}
    </div>
  );
};
