import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PlayPage from "./pages/PlayPage";
import RulesPage from "./pages/RulesPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/play" element={<PlayPage />} />
        <Route path="/rules" element={<RulesPage />} />
      </Routes>
    </BrowserRouter>
  );
}
