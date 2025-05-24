// Додамо цю функцію для рендеру знаків
export const renderSign = (signId) => {
    switch(signId) {
      case 'stop':
        return <span className="text-red-500 font-bold text-2xl">!</span>;
      case 'main_road':
        return <span className="text-yellow-300 font-bold text-2xl">◆</span>;
      case 'give_way':
        return <span className="text-red-500 font-bold text-2xl">▼</span>;
      case 'traffic_light':
        return <span className="text-green-600 font-bold text-2xl">●</span>;
      default:
        return null;
    }
  };