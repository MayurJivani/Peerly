import { useState, useEffect } from "react";
import { Peer } from "peerjs";
import "./App.css";

export default function FileTransferApp() {
  const [peerId, setPeerId] = useState("");
  const [remoteId, setRemoteId] = useState("");
  const [peer, setPeer] = useState(null);
  const [connection, setConnection] = useState(null);
  const [status, setStatus] = useState("Not Connected");

  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);

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
    if (!remoteId || !peer) return;

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

      setDownloadProgress(100); // File fully received
      setTimeout(() => setDownloadProgress(0), 2000); // Reset after 2 sec
    }
  };

  const sendFile = (event) => {
    const file = event.target.files[0];
    if (!file || !connection) return;

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        let progress = (e.loaded / e.total) * 100;
        setUploadProgress(progress); // Show progress as % value
      }
    };

    reader.onload = () => {
      connection.send({ file: reader.result, filename: file.name });
      setUploadProgress(100); // Fully sent
      setTimeout(() => setUploadProgress(0), 2000); // Reset after 2 sec
    };
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

        {/* Progress Bars */}
        {uploadProgress > 0 && (
          <div className="progress-container">
            <p>Uploading: {uploadProgress.toFixed(0)}%</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {downloadProgress > 0 && (
          <div className="progress-container">
            <p>Downloading: {downloadProgress.toFixed(0)}%</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${downloadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
