import './App.css';
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Chat from "./pages/Chat";

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/">
                        <Route index element={<Home/>}/>
                        <Route path="login" element={<Login/>}/>
                        <Route path="chat" element={<Chat/>}/>
                    </Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
