import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import Home from "./Pages/Home/Home";
import MyAccount from "./Pages/MyAccount/MyAccount";
import SessionPage from "./Pages/SessionPage/SessionPage";
import Editor from "./Components/Editor/Editor";
import VideoCall from "./Components/VideoCall/VideoCall";
import AuthModal from "./Components/AuthModal/AuthModal";
import { useState } from "react";

function App() {
    const [authModalOpen, setAuthModalOpen] = useState(false);
    
    return (
        <>
            <Navbar openAuth={() => setAuthModalOpen(true)} />
            {authModalOpen && <AuthModal closeAuth={() => setAuthModalOpen(false)} />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/session" element={<SessionPage />} />
                <Route path="/myaccount" element={<MyAccount />} />
                <Route path="/editor/:roomId" element={<Editor />} />
                <Route path="/video/:roomId" element={<VideoCall />} />
            </Routes>
            <Footer />
        </>
    );
}

export default App;
