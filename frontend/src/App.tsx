import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AddPost from './pages/AddPost';
import EditPost from './pages/EditPost';
import Preview from './pages/Preview';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50/50">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<AddPost />} />
              <Route path="/edit/:id" element={<EditPost />} />
              <Route path="/preview" element={<Preview />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
