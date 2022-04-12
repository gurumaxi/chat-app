import React from "react";
import { socket } from ".";
import { deleteLastMessage, getMessages, postMessage, getUsers, fadeLastMessage, updateNickname, postUser } from "./api";
import LoginModal from "./components/loginModal/loginModal";
import Bubble from "./components/bubble/bubble";
import Countdown from "./components/countdown/countdown";

const LOCAL_STORAGE_USER_ID = "userId";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            users: [],
            messages: [],
            messageText: "",
            currentUserId: localStorage.getItem(LOCAL_STORAGE_USER_ID) || null,
            username: "",
            typingTimeout: null,
            countdownData: null
        };
    }

    componentDidMount() {
        socket.on("newMessage", message => {
            this.setState({ messages: [...this.state.messages, message] });
            this.scrollToBottom();
        });
        socket.on("messageChanged", message => {
            const index = this.state.messages.findIndex(m => m._id === message._id);
            this.state.messages[index] = message;
            this.setState({ messages: this.state.messages });
        });
        socket.on("messageRemoved", message => this.setState({ messages: this.state.messages.filter(m => m._id !== message._id) }));
        socket.on("userChanged", () =>
            getUsers().then(users => {
                this.setState({ users });
                if (!this.state.currentUserId) {
                    const userId = users.find(u => u.username === this.state.username)._id;
                    this.setState({ currentUserId: userId });
                    localStorage.setItem(LOCAL_STORAGE_USER_ID, userId);
                }
            })
        );
        socket.on("countdown", data => {
            if (data.userId !== this.state.currentUserId) {
                this.setState({ countdownData: data });
            }
        });
        getUsers().then(users => this.setState({ users }));
        getMessages().then(messages => {
            this.setState({ messages });
            this.scrollToBottom(false);
        });
    }

    onSubmit = () => {
        const text = this.state.messageText.trim();
        if (text.length) {
            const [firstWord, ...otherWords] = text.split(" ");
            if (firstWord === "/nick" && otherWords.length) {
                updateNickname(this.state.currentUserId, otherWords.join(" ").toLowerCase());
            } else if (firstWord === "/think") {
                this.sendMessage(otherWords.join(" "), true);
            } else if (firstWord === "/highlight") {
                this.sendMessage(otherWords.join(" "), false, true);
            } else if (firstWord === "/oops") {
                deleteLastMessage(this.state.currentUserId);
            } else if (firstWord === "/fadelast") {
                fadeLastMessage(this.state.currentUserId);
            } else if (firstWord === "/countdown" && otherWords.length === 2) {
                socket.emit("countdown", { userId: this.state.currentUserId, number: Number(otherWords[0]) || 3, url: otherWords[1] });
            } else {
                this.sendMessage(text);
            }
        }
        this.setState({ messageText: "" });
    };

    sendMessage = (text, think = false, highlight = false) => {
        const newMessage = { userId: this.state.currentUserId, text, think, highlight, fade: false };
        postMessage(newMessage).then(this.scrollToBottom);
    };

    scrollToBottom = (smooth = true) => {
        const main = document.querySelector("main");
        setTimeout(() => main.scrollTo({ top: main.scrollHeight, behavior: smooth ? "smooth" : "auto" }), 5);
    };

    createUser = username => {
        this.setState({ username });
        postUser(username);
    };

    handleTypingEvent = () => {
        const emitTypingEvent = typing => socket.emit("typing", { typing, userId: this.state.currentUserId });
        !this.state.typingTimeout ? emitTypingEvent(true) : clearTimeout(this.state.typingTimeout);
        this.state.typingTimeout = setTimeout(() => {
            this.setState({ typingTimeout: null });
            emitTypingEvent(false);
        }, 500);
    };

    render() {
        return (
            <div className="App">
                {!this.state.currentUserId && <LoginModal createUser={this.createUser} />}
                {this.state.countdownData && this.state.currentUserId && (
                    <Countdown
                        number={this.state.countdownData.number}
                        url={this.state.countdownData.url}
                        onRedirect={() => this.setState({ countdownData: null })}
                    />
                )}
                <header>
                    <h2>Chat-App</h2>
                    <div className="chips">
                        {this.state.users.map((user, index) => (
                            <div className="user-chip" key={index}>
                                <span>{user.username}</span>
                                {user.typing && <span className="typing"> is typing...</span>}
                            </div>
                        ))}
                    </div>
                </header>
                <main>
                    {this.state.messages.map((message, index) => (
                        <Bubble message={message} users={this.state.users} currentUserId={this.state.currentUserId} key={index} />
                    ))}
                </main>
                <div className="input-container">
                    <input
                        value={this.state.messageText}
                        onChange={event => this.setState({ messageText: event.target.value })}
                        onKeyDown={this.handleTypingEvent}
                        onKeyPress={event => {
                            if (event.key === "Enter") {
                                this.onSubmit();
                            }
                        }}
                    />
                    <button className="send-button icon" onClick={this.onSubmit}>
                        send
                    </button>
                </div>
            </div>
        );
    }
}
