import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatApp from "./components/display/ChatApp";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatApp />} />
      </Routes>
    </Router>
  );
};

export default App;
