import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FamilyTree from "./components/FamilyTree"
import LandingPage from "./LandingPage"
import FamilyDetails from "./components/FamilyDetails";

function App() {


  return (
    <Router>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/family/:id" element={<FamilyDetails />} />
        </Routes>
    </Router>
  )
}

export default App
