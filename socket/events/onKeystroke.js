export default function onKeystroke(socket, name) {
  socket.broadcast.emit("onKeystroke", name);
}
