import React from 'react';
import MeteoAIAssistant from '../components/MeteoAIAssistant';

export default function Chat({ weatherList }) {
  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', paddingBottom: '3rem' }}>
      <MeteoAIAssistant weatherList={weatherList} isFloating={false} />
    </div>
  );
}
