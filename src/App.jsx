import './App.css';
import { Routes,Route} from "react-router-dom";
import UserManagement from './components/UserManagement';
import RoleManagement from './components/RoleManagement';
import Home from './components/Home';

function App() {

  return (
    <>
     <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/users" element={<UserManagement/>} />
          <Route path="/roles" element={<RoleManagement/>} />
     </Routes>
    </>
  )
}

export default App
