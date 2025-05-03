import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Index from "./pages/IndexPage.jsx";
import Test from "./pages/TestPage.jsx";
import Theme from "./pages/ThemePage.jsx";
import Profile from "./pages/ProfilePage.jsx";
import Statistics from "./pages/StatisticsPage.jsx";
import Registration from "./pages/RegistrationPage.jsx";
import Authorization from "./pages/AuthorizationPage.jsx";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/theme" element={<Theme />} />
          <Route path="/tests" element={<Test />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/auth" element={<Authorization />} />
          <Route path="/register" element={<Registration />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
