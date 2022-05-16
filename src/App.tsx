import { BrowserRouter, Route, Routes } from "react-router-dom";
import Favorites from "./pages/favorites/Favorites";

import ImageSlideShow from "./pages/image-slide-show/ImageSlideShow";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<ImageSlideShow />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
