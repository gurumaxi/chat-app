import React from "react";
import "./loginModal.scss";

export default class LoginModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ""
        };
    }

    startChatting = () => {
        this.props.createUser(this.state.name.toLowerCase());
    };

    render() {
        return (
            <div className="background">
                <div className="modal">
                    <div className="modal-header">Enter your name</div>
                    <input
                        value={this.state.name}
                        onChange={event => this.setState({ name: event.target.value })}
                        onKeyPress={event => {
                            if (event.key === "Enter") {
                                this.startChatting();
                            }
                        }}
                    />
                    <button onClick={this.startChatting}>Start chatting</button>
                </div>
            </div>
        );
    }
}
