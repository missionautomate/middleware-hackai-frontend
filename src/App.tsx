import { BrowserRouter, Route, Routes } from "react-router-dom";

import ImageSlideShow from "./pages/ImageSlideShow copy";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<ImageSlideShow />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
