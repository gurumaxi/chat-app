import "./bubble.scss";

export function Bubble(props) {
    const isMyMessage = props.currentUserId === props.message.userId;
    const username = props.users.find(u => u._id === props.message.userId)?.username;

    return (
        <div className={`bubble-container ${isMyMessage ? "my-message" : "other-message"}`}>
            <div className="bubble">
                <div className="username">{username}</div>
                <div className={`text ${props.message.think ? "think" : ""}`}> {props.message.text}</div>
            </div>
        </div>
    );
}
