import React from 'react';
import { Header } from '../stories/Header';
import { Button } from '../stories/Button';

const ListComponent = () =>
  React.createElement(
    'ul',
    { style: { marginBottom: 12, paddingLeft: 18 } },
    React.createElement('li', null, 'Item 1'),
    React.createElement('li', null, 'Item 2')
  );

const ModalComponent = () =>
  React.createElement(
    'div',
    {
      style: {
        background: 'rgba(255,255,255,0.08)',
        color: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        fontSize: 14,
        fontWeight: 500,
        border: '1px solid rgba(255,255,255,0.10)'
      }
    },
    'Example Modal (stub)'
  );

export const componentMap = {
  header: () => React.createElement(Header, { user: { name: 'Jane Doe' } }),
  list: ListComponent,
  button: () => React.createElement(Button, { label: 'Action Button', primary: true }),
  primaryButton: () => React.createElement(Button, { label: 'Action Button', primary: true }),
  modal: ModalComponent
};
