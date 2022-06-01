import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Favorites from "./pages/favorites/Favorites";
import './App.css';
import ImageSlideShow from "./pages/image-slide-show/ImageSlideShow";
import LoginPage from "./pages/LoginPage";
import { UserProvider } from "./provider/user.provider";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar></Navbar>
          <div className="app-content">
            <Routes>
              <Route index element={<ImageSlideShow />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </div>
          <div className="footer"></div>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}
export default App;
