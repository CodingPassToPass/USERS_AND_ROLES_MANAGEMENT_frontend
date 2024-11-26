import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from "./redux/store.jsx"; 
import { Toaster} from "react-hot-toast";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter> 
    
    <Toaster 
        position='bottom-center'
        toastOptions={{
          success:{ duration:5000},
          error: { duration: 5000}
        }}    
    />
  </StrictMode>,
)
