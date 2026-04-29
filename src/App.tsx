import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { Workout } from "./pages/Workout";
import History from "./pages/History";
import Preview from "./pages/Preview";
import Settings from "./pages/Settings";
import Navbar from "./components/Navbar";
import { AppProvider } from "./store";

function App() {
  return (
    <AppProvider>
      <Navbar />

      {/* 🔹 Seiten */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workout" element={<Workout />} />
        <Route path="/history" element={<History />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </AppProvider>
  );
}

export default App;