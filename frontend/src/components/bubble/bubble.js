import React from "react";
import "./bubble.scss";

export default class Bubble extends React.Component {
    constructor(props) {
        super(props);
    }

    isMyMessage = () => {
        return this.props.currentUserId === this.props.message.userId;
    };

    getUsername = () => {
        return this.props.users.find(u => u._id === this.props.message.userId)?.username;
    };

    render() {
        return (
            <div className={`bubble-container ${this.isMyMessage() ? "my-message" : "other-message"}`}>
                <div className="bubble">
                    <div className="username">{this.getUsername()}</div>
                    <div className={`text ${this.props.message.think ? "think" : ""}`}> {this.props.message.text}</div>
                </div>
            </div>
        );
    }
}
