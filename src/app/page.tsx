import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Donation Product Inventory',
  description: 'Lightweight inventory management system for donation products',
};

export default function HomePage() {
  return (
    <html lang="en">
      <body>
        <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
          <h1>Donation Product Inventory</h1>
          <p>A lightweight inventory management system for donation products.</p>
          <p>
            <a href="/admin" style={{ color: '#0070f3', textDecoration: 'underline' }}>
              Go to Admin Panel
            </a>
          </p>
        </div>
      </body>
    </html>
  );
}
