import { getAuth, signInAnonymously } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";
import app from "../firebase";
import {useState} from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const auth = getAuth(app);
    const userExists = async (username) => {
        const db = getDatabase(app);
        const userRef = ref(db, `users/${username}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            return true;
        } else {
            return false;
        }
    }
    // Make the user select a username and login using firebase
    const onClickLogin = async () => {
        if (username.length < 3) {
            alert("Username must be at least 3 characters long");
            return;
        }
        if (username.length > 20) {
            alert("Username must be at most 20 characters long");
            return;
        }
        if (username.includes(" ")) {
            alert("Username cannot contain spaces");
            return;
        }
        if (await userExists(username)) {
            alert("Username already exists");
            return;
        }
        const { user } = await signInAnonymously(auth);
        const db = getDatabase(app);
        const userRef = ref(db, `users/${username}`);
        await set(userRef, {
            uid: user.uid,
        });
        localStorage.setItem("token", user.uid);
        localStorage.setItem("username", username);
        alert("Logged in successfully");
        navigate("/");
    }
    return(
        <div className={'h-screen w-screen flex flex-col justify-center content-center space-y-5'}>
            <h2>Please choose a username</h2>
            <div className={'flex flex-row justify-center content-center !mt-2'}>
                <input type="text" className={'h-5 w-36 border-2 mt-0'} onChange={(e) => setUsername(e.target.value)} value={username} />
            </div>
            <div className={'flex flex-row justify-center content-center !mt-2'}>
                <button onClick={onClickLogin} className={'border-2 w-32'}>Login</button>
            </div>
        </div>
    )
}
