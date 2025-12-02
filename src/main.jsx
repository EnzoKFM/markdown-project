import { createRoot } from 'react-dom/client';
import App from './components/App';
import './main.css';

const root = createRoot(document.querySelector('#root'));
root.render(<App />);
