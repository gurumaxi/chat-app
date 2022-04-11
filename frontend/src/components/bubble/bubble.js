import "./bubble.scss";

export function Bubble(props) {
    const isMyMessage = props.currentUser === props.message.userId;

    return (
        <div className={`bubble-container ${isMyMessage ? "my-message" : "other-message"}`}>
            <div className="bubble">{props.message.text}</div>
        </div>
    );
}
