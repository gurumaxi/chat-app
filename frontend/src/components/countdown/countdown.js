import React from "react";
import "./countdown.scss";

export default class Countdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            interval: null,
            seconds: this.props.number
        };
    }

    componentDidMount() {
        this.setState({
            interval: setInterval(() => {
                this.setState({ seconds: this.state.seconds - 1 });
                if (this.state.seconds === 0) {
                    window.open(this.props.url);
                    clearInterval(this.state.interval);
                    this.props.onRedirect();
                }
            }, 1000)
        });
    }

    render() {
        return (
            <div className="countdown">
                <div className="countdown-number">{Math.max(this.state.seconds, 0)}</div>
            </div>
        );
    }
}
