import Canvas from './components/canvas/Canvas';
import ComponentLibrary from './components/panels/ComponentLibrary';
import PropertiesPanel from './components/panels/PropertiesPanel';
import Toolbar from './components/toolbar/Toolbar';

function App() {
  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <ComponentLibrary />
        <Canvas />
        <PropertiesPanel />
      </div>
    </div>
  );
}

export default App;
