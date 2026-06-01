import { Component } from "react";
import { io } from "socket.io-client";
import { getApi } from "../lib/runtimeEnv";

class WebSocket extends Component {
  socket = null;
  userRoom = null;
  ticketRoom = null;

  componentDidMount() {
    if (process.env.IS_TEST_MODE === "true") return;
    this.socket = io(getApi(), {
      transports: ["websocket", "polling"],
      autoConnect: false,
      multiplex: false,
    });

    this.socket.on("reload-user", () => {
      if (this.props.realodPage) this.props.realodPage();
    });
    this.socket.on("reload-ticket", () => {
      if (this.props.realodPage) this.props.realodPage();
    });
    for (const event of this.props.event || []) {
      this.socket.on(event.name, () => event.action());
    }

    // À chaque (re)connexion, le socket repart d'un id neuf : on rejoint les rooms.
    this.socket.on("connect", () => {
      this.userRoom = null;
      this.ticketRoom = null;
      this.joinRooms();
    });

    this.socket.connect();
  }

  componentDidUpdate() {
    // userId / ticketId arrivent souvent après le fetch initial (id = 0 au départ).
    this.joinRooms();
  }

  joinRooms() {
    if (!this.socket) return;
    const userRoom = this.props.userId ? `user-${this.props.userId}` : null;
    if (userRoom && userRoom !== this.userRoom) {
      this.socket.emit("join-room", userRoom);
      this.userRoom = userRoom;
    }
    const ticketRoom = this.props.ticketId
      ? `ticket-${this.props.ticketId}`
      : null;
    if (ticketRoom && ticketRoom !== this.ticketRoom) {
      this.socket.emit("join-room", ticketRoom);
      this.ticketRoom = ticketRoom;
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
