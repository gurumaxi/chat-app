import { useState, useEffect } from "react";
import { socket } from ".";
import { deleteLastMessage, getMessages, postMessage, getUsers, saveUser } from "./api";
import { Bubble } from "./components/bubble/bubble";
import { LoginModal } from "./components/loginModal/loginModal";

const LOCAL_STORAGE_USER_ID = "userId";

function App() {
    const [users, setUsers] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(localStorage.getItem(LOCAL_STORAGE_USER_ID) || null);
    const [messageText, setMessageText] = useState("");
    const [allMessages, setAllMessages] = useState([]);

    useEffect(() => {
        socket.on("newMessage", message => setAllMessages(prevState => [...prevState, message]));
        socket.on("messageRemoved", message => setAllMessages(prevState => prevState.filter(m => m._id !== message._id)));
        socket.on("userChanged", user =>
            setUsers(prevState => {
                const index = prevState.find(u => u._id === user._id);
                if (index < 0) {
                    return [...prevState, user];
                } else {
                    prevState[index] = user;
                    return prevState;
                }
            })
        );

        getMessages().then(messages => setAllMessages(messages));
        getUsers().then(users => setUsers(users));
    }, []);

    function startChatting(username) {
        saveUser(username).then(() => {
            const userId = users.find(u => u.username === username)._id;
            setCurrentUserId(userId);
            localStorage.setItem(LOCAL_STORAGE_USER_ID, userId);
        });
    }

    function onSubmit() {
        if (messageText.length) {
            const [firstWord, ...otherWords] = messageText.trim().split(" ");
            if (firstWord === "/nick" && otherWords.length) {
                saveUser(otherWords.join("_"), currentUserId);
            } else if (firstWord === "/think") {
                sendMessage(otherWords.join(" "), true);
            } else if (firstWord === "/oops") {
                deleteLastMessage(currentUserId);
            } else {
                sendMessage(messageText);
            }
            setMessageText("");
        }
    }

    function sendMessage(text, think = false) {
        const newMessage = { userId: currentUserId, text, think };
        postMessage(newMessage).then(() => {
            setTimeout(() => {
                document.querySelector("main").scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
            }, 5);
        });
    }

    return (
        <div className="App">
            {!currentUserId && <LoginModal startChatting={startChatting} />}
            <header>
                <h2>Chat-App</h2>
            </header>
            <main>
                {allMessages.map((message, index) => (
                    <Bubble message={message} users={users} currentUserId={currentUserId} key={index} />
                ))}
            </main>
            <div className="input-container">
                <input
                    value={messageText}
                    onChange={event => setMessageText(event.target.value)}
                    onKeyPress={event => {
                        if (event.key === "Enter") {
                            onSubmit();
                        }
                    }}
                />
                <button className="send-button icon" onClick={onSubmit}>
                    send
                </button>
            </div>
        </div>
    );
}

export default App;
