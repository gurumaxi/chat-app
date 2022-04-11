import { useState } from "react";
import { Bubble } from "./components/bubble/bubble";
import { Header } from "./components/header/header";

function App() {
    const currentUser = 1;

    const [messageText, setMessageText] = useState("");
    const [allMessages, setAllMessage] = useState([
        { user: 1, text: "Hi user 2" },
        { user: 2, text: "Howdy" },
        { user: 2, text: "How are you doing?" },
        { user: 1, text: "I am fine thanks." },
        { user: 2, text: "Let's do something today" }
    ]);

    function sendMessage() {
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
                    const newMessage = { user: 1, text: messageText };
                    setAllMessage([...allMessages, newMessage]);
                    setMessageText("");
                    setTimeout(() => {
                        document.querySelector("main").scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                    }, 5);
            }
        }
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
