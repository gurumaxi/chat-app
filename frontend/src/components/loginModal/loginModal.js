import { useState } from "react";
import "./loginModal.scss";

export function LoginModal(props) {
    const [name, setName] = useState("");

    return (
        <div className="background">
            <div className="modal">
                <div className="modal-header">Enter your name</div>
                <input
                    value={name}
                    onChange={event => setName(event.target.value)}
                    onKeyPress={event => {
                        if (event.key === "Enter") {
                            props.startChatting(name);
                        }
                    }}
                />
                <button onClick={() => props.startChatting(name)}>Start chatting</button>
            </div>
        </div>
    );
}
