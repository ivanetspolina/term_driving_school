import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Index from "./pages/IndexPage.jsx";
import Test from "./pages/TestPage.jsx";
import Theme from "./pages/ThemePage.jsx";
import Profile from "./pages/ProfilePage.jsx";
import Statistics from "./pages/StatisticsPage.jsx";
import Registration from "./pages/RegistrationPage.jsx";
import Authorization from "./pages/AuthorizationPage.jsx";
import RunTest from "./pages/RunTestPage.jsx";
import Result from "./pages/ResultPage.jsx";
import Activate from "./pages/ActivatePage.jsx";
import NoPage from "./pages/NoPage.jsx";
import Layout from "./pages/Layout.jsx";

function App() {
  return (
    <>
      <Router>
        <Routes >
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="theme" element={<Theme />} />
            <Route path="tests" element={<Test />} />
            <Route path="profile" element={<Profile />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="auth" element={<Authorization />} />
            <Route path="register" element={<Registration />} />
            <Route path="runtest" element={<RunTest />} />
            <Route path="result_test" element={<Result />} />
            <Route path="activate" element={<Activate />} />
            <Route path="activate/:token" element={<Activate />} />
            <Route path="*" element={<NoPage />} />
          </Route>


        </Routes>
      </Router>
    </>
  );
}

export default App;
