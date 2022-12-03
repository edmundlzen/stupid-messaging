import {getDatabase, ref, onValue, child, push, get, remove} from "firebase/database";
import app from "../firebase";
import {useEffect, useState} from "react";
import {Configuration, OpenAIApi} from "openai";

const configuration = new Configuration({
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const db = getDatabase(app);
    const roomRef = ref(db, 'rooms/' + localStorage.getItem("room"));
    useEffect(() => {
        const unsubscribe = onValue(roomRef, (snapshot) => {
            const data = snapshot.val();
            setMessages(Object.values(data.messages));
        });
        return () => unsubscribe();
    }, [roomRef]);

    useEffect(() => {
        const unsubscribe = onValue(roomRef, (snapshot) => {
            const data = snapshot.val();
            setUsers(Object.values(data.users));
        });
        return () => unsubscribe();
    }, [roomRef]);

    const sendMessage = async (message) => {
        if (message.length < 1) {
            alert("Message must be at least 1 characters long");
            return;
        }
        if (message.length > 100) {
            alert("Message must be at most 100 characters long");
            return;
        }

        // Convert the user's message to a shakespearian style message
        const prompt = message + "\n\n" + "Convert to Shakespearean style:";
        const response = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer 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",
            },
            body: JSON.stringify({
                model: "text-davinci-003",
                prompt: prompt,
                max_tokens: 100,
                temperature: 0.9,
            })
        });
        const responsejson = await response.json()
        push(child(roomRef, "messages"), {
            username: localStorage.getItem("username"),
            message: responsejson.choices[0].text,
        });
    }

    const leaveRoom = async () => {
        const usersRef = ref(db, `rooms/${localStorage.getItem("room")}/users`);
        const snapshot = await get(usersRef);
        const users = snapshot.val();
        const usersObj = Object.entries(users);
        for (const user in usersObj) {
            if (usersObj[user][1] === localStorage.getItem("username")) {
                await remove(child(usersRef, usersObj[user][0]));
            }
        }
        localStorage.removeItem("room");
        window.location.href = "/";
    }

    return (
        <div className={'h-screen flex'}>
            <div className={'w-1/4 bg-gray-200'}>
                <div className={'p-4'}>
                    <h1 className={'text-2xl font-bold'}>Room: {localStorage.getItem("room")}</h1>
                </div>
                <div className={'p-4'}>
                    <h1 className={'text-xl font-bold'}>Users:</h1>
                    <ul>
                        {users.map((user, index) => {
                            return <li key={index}>{user}</li>
                        })}
                    </ul>
                </div>
            </div>
            <div className={'w-3/4 bg-gray-100'}>
                <div className={'p-4'}>
                    <h1 className={'text-2xl font-bold'}>Messages:</h1>
                    <ul>
                        {messages.map((message) => {
                            return (
                                <li>{message.username}: {message.message}</li>
                            )
                        })}
                    </ul>
                </div>
            </div>
            <div className={'w-full bg-gray-100'}>
                <div className={'p-4'}>
                    <h1 className={'text-2xl font-bold'}>Send a message:</h1>
                    <input type="text" value={message} onChange={(e) => setMessage(e.target.value)}/>
                    <button onClick={() => sendMessage(message)}>Send</button>
                </div>
            </div>
            <div className={'w-full bg-gray-100'}>
                <div className={'p-4'}>
                    <button onClick={() => leaveRoom()}>Leave Room</button>
                </div>
            </div>
        </div>
    );
}