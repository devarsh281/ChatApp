import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ChatApp from "./components/Display/ChatApp";

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
