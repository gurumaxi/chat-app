import { useState, useEffect } from "react";
import { socket } from ".";
import { getMessages, postMessage } from "./api";
import { Bubble } from "./components/bubble/bubble";
import { Header } from "./components/header/header";

function App() {
    const currentUser = 1;
    const [messageText, setMessageText] = useState("");
    const [allMessages, setAllMessages] = useState([]);

    useEffect(() => {
        getMessages().then(messages => setAllMessages(messages));
    }, []);

    function sendMessage() {
        socket.emit("howdy", "test1234");
        if (messageText.length) {
            const [firstWord, ...otherWords] = messageText.trim().split(" ");
            switch (firstWord) {
                case "/nick":
                    // TODO: change nick name
                    break;
                case "/think":
                    // TODO: change text color
                    break;
                case "/oops":
                    // TODO: remove last message
                    break;
                default:
                    const newMessage = {
                        userId: currentUser,
                        text: messageText
                    };
                    postMessage(newMessage).then(message => {
                        addNewMessage(message);
                        setMessageText("");
                        setTimeout(() => {
                            document.querySelector("main").scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                        }, 5);
                    });
            }
        }
    }

    function addNewMessage(message) {
        setAllMessages([...allMessages, message]);
    }

    return (
        <div className="App">
            <Header />
            <main>
                {allMessages.map((message, index) => (
                    <Bubble message={message} currentUser={currentUser} key={index} />
                ))}
            </main>
            <div className="input-container">
                <input value={messageText} onChange={event => setMessageText(event.target.value)} />
                <button className="send-button icon" onClick={sendMessage}>
                    send
                </button>
            </div>
        </div>
    );
}

export default App;
