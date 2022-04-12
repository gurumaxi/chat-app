import React from "react";
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
    const [username, setUsername] = useState("");

    useEffect(() => {
        socket.on("newMessage", message => setAllMessages(prevState => [...prevState, message]));
        socket.on("messageRemoved", message => setAllMessages(prevState => prevState.filter(m => m._id !== message._id)));
        socket.on("userChanged", () =>
            getUsers().then(users => {
                setUsers(users);
                if (!currentUserId) {
                    const userId = users.find(u => u.username === username)._id;
                    setCurrentUserId(userId);
                    //localStorage.setItem(LOCAL_STORAGE_USER_ID, userId);
                }
            })
        );
        getUsers().then(users => setUsers(users));
        getMessages().then(messages => {
            setAllMessages(messages);
            scrollToBottom(false);
        });
    }, []);

    useEffect(() => {
        if (username) saveUser(username);
    }, [username]);

    function startChatting(name) {
        setUsername(name.toLowerCase());
    }

    function onSubmit() {
        if (messageText.length) {
            const [firstWord, ...otherWords] = messageText.trim().split(" ");
            if (firstWord === "/nick" && otherWords.length) {
                saveUser(otherWords.join("_").toLowerCase(), currentUserId);
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
        postMessage(newMessage).then(scrollToBottom);
    }

    function scrollToBottom(smooth = true) {
        const main = document.querySelector("main");
        setTimeout(() => main.scrollTo({ top: main.scrollHeight, behavior: smooth ? "smooth" : "auto" }), 5);
    }

    return (
        <div className="App">
            {!currentUserId && <LoginModal setUsername={setUsername} />}
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
