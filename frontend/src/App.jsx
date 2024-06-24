import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainHeader from "./shared/components/Navigation/MainHeader";
import MainFooter from "./shared/components/Navigation/MainFooter";
import NotFoundPage from "./shared/pages/NotFoundPage";
import HomePage from "./shared/pages/HomePage";
import AboutPage from "./shared/pages/AboutPage";

function App() {
  return (
    <Router>
      <MainHeader />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <MainFooter />
    </Router>
  );
}

export default App;
