import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Room from './pages/Room.jsx';
import { PeerProvider } from "./providers/peer.jsx";
import { SocketProvider } from "./providers/SocketContext.jsx";
function App() {
  return (
    <div className="app">
      <SocketProvider>
        <PeerProvider>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/room/:roomId" element={<Room />}></Route>
          </Routes>
        </PeerProvider>
      </SocketProvider>
    </div>
  );
}

export default App;
