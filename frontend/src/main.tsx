// Hooks
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

// Components
import App from './App.tsx';

// Store
import store from './store/index.ts';

// Styles
import './index.css';


const persistor = persistStore(store);


createRoot(document.getElementById('root')!).render(
	<Provider store={ store }>
		<PersistGate loading={ null } persistor={ persistor }>
			<App />
		</PersistGate>
	</Provider>,
);
