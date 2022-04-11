import "./bubble.scss";

export function Bubble(props) {
    const isMyMessage = props.currentUser === props.message.user;

    return (
        <div className={`bubble-container ${isMyMessage ? "my-message" : "other-message"}`}>
            <div className="bubble">{props.message.text}</div>
        </div>
    );
}
