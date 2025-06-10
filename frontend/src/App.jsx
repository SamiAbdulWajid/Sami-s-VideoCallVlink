import React from 'react';
import LandingPage from './pages/landing.jsx';
import './App.css';
import { Route , BrowserRouter as Router,Routes } from 'react-router-dom';
import Authentication from './pages/authentication';
import { AuthProvider } from './contexts/AuthContext.jsx';
import VideoMeetComponent from './pages/VideoMeet.jsx';
import HomeComponent from './pages/home.jsx';
import HistoryComponent from './pages/history.jsx';

function App() {
  return (
    <>
      <Router>

        <AuthProvider>

        <Routes>
            <Route path='/' element={<LandingPage/>} />
            <Route path='/auth' element={<Authentication/>} />
            <Route path='/home' element={<HomeComponent/>}/>
            <Route path='/history' element={<HistoryComponent/>}/>
            <Route path='/:url' element={<VideoMeetComponent/>} />
            
        </Routes>

      </AuthProvider>  
      </Router>
        
      
    </>
  );
}

export default App;