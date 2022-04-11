import { useState, useEffect } from "react";
import { socket } from ".";
import { deleteLastMessage, getMessages, postMessage } from "./api";
import { Bubble } from "./components/bubble/bubble";
import { Header } from "./components/header/header";

function App() {
    const currentUserId = 1;
    const [messageText, setMessageText] = useState("");
    const [allMessages, setAllMessages] = useState([]);

    useEffect(() => {
        getMessages().then(messages => setAllMessages(messages));
        socket.on("newMessage", message => setAllMessages(prevState => [...prevState, message]));
        socket.on("messageRemoved", message => setAllMessages(prevState => prevState.filter(m => m._id !== message._id)));
    }, []);

    function onSubmit() {
        if (messageText.length) {
            const [firstWord, ...otherWords] = messageText.trim().split(" ");
            if (firstWord === "/nick") {
                // TODO: change nick name
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
        const newMessage = {
            userId: currentUserId,
            text,
            think
        };
        postMessage(newMessage).then(() => {
            setTimeout(() => {
                document.querySelector("main").scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
            }, 5);
        });
    }

    return (
        <div className="App">
            <Header />
            <main>
                {allMessages.map((message, index) => (
                    <Bubble message={message} currentUserId={currentUserId} key={index} />
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
