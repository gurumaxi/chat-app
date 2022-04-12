import React from "react";
import ReactDOM from "react-dom";
import "./bubble.scss";

export default class Bubble extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        ReactDOM.findDOMNode(this).querySelector(".text").innerHTML = this.props.message.text
            .replaceAll("(smile)", "<span>&#128512;</span>")
            .replaceAll("(wink)", "<span>&#128075;</span>")
            .replaceAll("(lion)", "<span>&#129409;</span>")
            .replaceAll("(check)", "<span>&#9989;</span>");
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
                <div className={`bubble ${this.props.message.fade ? "fade-out" : ""}`}>
                    <div className="username">{this.getUsername()}</div>
                    <div className={`text ${this.props.message.think ? "think" : ""} ${this.props.message.highlight ? "highlight" : ""}`}></div>
                </div>
            </div>
        );
    }
}
