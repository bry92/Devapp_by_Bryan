import { Header } from '../stories/Header';
import { Button } from '../stories/Button';
import React from 'react';

const ListComponent = () => (
  <ul style={{ marginBottom: 12, paddingLeft: 18 }}>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
);

const ModalComponent = () => (
  <div style={{
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: 500,
    border: '1px solid rgba(255,255,255,0.10)'
  }}>
    Example Modal (stub)
  </div>
);

export const componentMap = {
  header: () => <Header user={{ name: 'Jane Doe' }} />, // Example usage
  list: ListComponent,
  button: () => <Button label="Action Button" primary />,
  primaryButton: () => <Button label="Action Button" primary />,
  modal: ModalComponent
};
