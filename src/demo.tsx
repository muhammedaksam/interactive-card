import React from 'react';
import ReactDOM from 'react-dom/client';
import InteractivePayCard from './components/InteractivePayCard';
import { CardFormData } from './types';

// Demo component for development purposes
export const App: React.FC = () => {
  const handleSubmit = (data: CardFormData) => {
    // eslint-disable-next-line no-console
    console.log('Form submitted:', data);
    alert('Card submitted! Check console for details.');
  };

  return (
    <div>
      <InteractivePayCard
        onSubmit={handleSubmit}
        locale="en"
        randomBackgrounds={true}
      />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
