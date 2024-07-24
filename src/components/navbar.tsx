import { Link } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import logo from "../images/logo.png";




export const Navbar = () => {

const [user] = useAuthState(auth);
const signUserOut = async () => {
await signOut(auth);
};

return <div className="navbar">
      <Link to ="/"> <img src={logo} alt="logo" className="hackerNewsLogo"/></Link>
     <Link to="/" className="Link"> <h2>Hacker News Clone</h2></Link>  
     {!user ? <Link to="/login" className="right-links">Login</Link> : <Link to="/submit" className="Link" id="submitLink">| submit</Link>  }
     
     <div className="right-links">
        <p> {user?.displayName} </p>  
        <button onClick={signUserOut} id="button">logout</button>
     </div> 
     </div>
};