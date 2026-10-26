import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="search" element={<SearchPage />} />
      </Route>
    </Routes>
  );
}

export default App;
