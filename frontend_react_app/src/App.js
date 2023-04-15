import { BrowserRouter, NavLink, Route, Routes} from "react-router-dom";
import Main from "./Main";
import Register from "./Register";
import Login from "./Login";
import Subscription from "./Subscription";


// taken reference from youtube: https://www.youtube.com/watch?v=ReNkQ0Xkccw&t=1913s
// reference from Mdn Documents for css
 
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <div className="header">
        <NavLink exact activeClass = "active" to="/">Home</NavLink>
        <NavLink activeClassName = "active" to="/register">Register</NavLink>
        <NavLink activeClassName = "active" to="/login">Login</NavLink>
        <NavLink activeClassName = "active" to="/subscription">Subscription Area</NavLink>
      </div>
      <div className="content">
      <Routes>
        <Route exact path="/" element={<Main/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/subscription" element={<Subscription/>}/>
      </Routes>
      </div>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
