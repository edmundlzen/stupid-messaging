import {useEffect, useState} from "react";
import {getDatabase, ref, set, get, child, push} from "firebase/database";
import app from "../firebase";
import {useNavigate} from "react-router-dom";


export default function Home() {
    const [roomName, setRoomName] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            window.location.href = "/login";
        }
    });

    useEffect(() => {
        if (localStorage.getItem("room")) {
            navigate("/chat");
        }
    }, [localStorage]);

    const joinOrCreateRoom = async (roomName) => {
        if (roomName.length < 1) {
            alert("Room name must be at least 1 characters long");
            return;
        }
        if (roomName.length > 20) {
            alert("Room name must be at most 20 characters long");
            return;
        }
        const db = getDatabase(app);
        const roomRef = ref(db, `rooms/${roomName.toLowerCase()}`);
        const snapshot = await get(roomRef);
        if (snapshot.exists()) {
            // Add ourselves to the room
            push(child(roomRef, "users"), localStorage.getItem("username"));
            localStorage.setItem("room", roomName.toLowerCase());
            navigate("/chat");
        } else {
            await set(roomRef, {
                messages: [],
                users: [
                    localStorage.getItem("username"),
                ]
            });
            localStorage.setItem("room", roomName.toLowerCase());
            navigate(`/chat`);
        }
    }

    return (
        <div className={'h-screen flex'}>
            <div className={'flex-1 flex flex-col justify-center content-center'}>
                Home
                <div>
                    Input a room id
                </div>
                <div className={'flex flex-row justify-center content-center !mt-2'}>
                    <input type="text" className={'w-36 border-2 rounded'}
                           value={roomName}
                           onChange={(e) => setRoomName(e.target.value)}/>
                </div>
                <div className={'flex flex-row justify-center content-center !mt-2'}>
                    <button className={'border-2 w-32 rounded'}
                            onClick={() => joinOrCreateRoom(roomName)}>Join
                    </button>
                </div>
            </div>
        </div>
    )
}
