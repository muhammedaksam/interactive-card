import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/style.scss';
import InteractivePayCard from './components/InteractivePayCard';
import { CardFormData } from './types';

// Demo component for development purposes
export function App() {
  const handleSubmit = (cardData: CardFormData) => {
    // eslint-disable-next-line no-console
    console.log('Card data submitted:', cardData);
    alert('Card submitted! Check console for details.');
  };

  return (
    <div className="wrapper">
      <InteractivePayCard
        onSubmit={handleSubmit}
        locale="en"
        randomBackgrounds={true}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
