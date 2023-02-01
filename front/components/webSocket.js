import { Component } from "react";
import { io } from "socket.io-client";

class WebSocket extends Component {
  socket = null;

  componentDidMount() {
    this.socket = io(process.env.API, { transports: ["websocket", "polling"], autoConnect: false, multiplex: false });
    this.socket.connect();
    if (this.props.userId) {
      this.socket.emit("join-room", `user-${this.props.userId}`);

      this.socket.on("reload-user", () => {
        this.props.realodPage();
      });
    }

    if (this.props.ticketId) {
      this.socket.emit("join-room", `ticket-${this.props.ticketId}`);

      this.socket.on("reload-ticket", () => {
        this.props.realodPage();
      });
    }

    for (const event of this.props.event) {
      this.socket.on(event.name, () => {
        event.action();
      });
    }
  }

  componentWillUnmount() {
    if (this.socket) this.socket.disconnect();
  }

  render() {
    return <div></div>;
  }
}

export default WebSocket;
