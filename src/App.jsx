import { useState, useEffect } from "react";
import { Peer } from "peerjs";
import "./App.css";

export default function FileTransferApp() {
  const [peerId, setPeerId] = useState("");
  const [remoteId, setRemoteId] = useState("");
  const [peer, setPeer] = useState(null);
  const [connection, setConnection] = useState(null);
  const [status, setStatus] = useState("Not Connected");

  useEffect(() => {
    const newPeer = new Peer();
    newPeer.on("open", (id) => setPeerId(id));

    newPeer.on("connection", (conn) => {
      conn.on("open", () => {
        setStatus("Connected to " + conn.peer);
        conn.send({ message: "Connected!" });
      });
      conn.on("data", handleData);
      setConnection(conn);
    });

    setPeer(newPeer);
    return () => newPeer.destroy();
  }, []);

  const connectToPeer = () => {
    if (!remoteId) return;
    const conn = peer.connect(remoteId);
    conn.on("open", () => {
      setStatus("Connected to " + remoteId);
      setConnection(conn);
      conn.send({ message: "Connected!" });
    });
    conn.on("data", handleData);
  };

  const handleData = (data) => {
    if (data.message) {
      setStatus("Connected to " + (connection ? connection.peer : remoteId));
    }
    if (data.file && data.filename) {
      const blob = new Blob([data.file]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const sendFile = (event) => {
    const file = event.target.files[0];
    if (!file || !connection) return;
    const reader = new FileReader();
    reader.onload = () => {
      connection.send({ file: reader.result, filename: file.name });
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Peerly</h2>
        <p>Your Peer ID:</p>
        <div className="peer-id">{peerId}</div>
        <p className="status">{status}</p>
        <input
          type="text"
          value={remoteId}
          onChange={(e) => setRemoteId(e.target.value)}
          placeholder="Enter Remote Peer ID"
          className="input-box"
        />
        <button onClick={connectToPeer} className="connect-btn">
          Connect
        </button>
        <input type="file" onChange={sendFile} className="file-input" />
      </div>
    </div>
  );
}
