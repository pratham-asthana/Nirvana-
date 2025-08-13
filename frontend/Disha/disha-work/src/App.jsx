
import "./App.css";
<<<<<<< HEAD
import RecordingPage from "./RecordingPage";
=======
import VideoAudio from "./Video-audio/VideoAudio";
import Login from "./login/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
>>>>>>> 7a22e2910fb7fb65b036437867733aa231213298

function App() {
  return (
    <div>
<<<<<<< HEAD
      <RecordingPage />
=======
      <Router>
        <Routes>
          <Route path="/interview" element={<VideoAudio />}></Route>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </Router>
>>>>>>> 7a22e2910fb7fb65b036437867733aa231213298
    </div>
  );
}

export default App;
