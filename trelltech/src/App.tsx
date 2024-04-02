import "./App.css";
import Header from "./layout/Header/Header";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Board from "./components/Board/Board";
import Menu from "./layout/Menu/Menu";
import WorkSpace from "./components/WorkSpace/WorkSpace";
function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <div>
          <Routes>
            <Route path="/board/:shortLink" element={<Board />} />
            <Route path="/" element={<Menu />} />
            <Route path="/workspace/:id" element={<WorkSpace />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
