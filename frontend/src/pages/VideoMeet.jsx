// import { io } from "socket.io-client";
// import React, { useState, useRef, useEffect } from 'react'
// import { useNavigate } from "react-router-dom";
// import { IconButton, TextField, Button, Paper, Box, Badge, Typography } from '@mui/material';
// import styles from "../styles/VideoComponent.module.css"
// import VideocamIcon from '@mui/icons-material/Videocam';
// import VideocamOffIcon from '@mui/icons-material/VideocamOff';
// import CallEndIcon from '@mui/icons-material/CallEnd';
// import MicIcon from '@mui/icons-material/Mic';
// import MicOffIcon from '@mui/icons-material/MicOff';
// import ScreenShareIcon from '@mui/icons-material/ScreenShare';
// import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
// import ChatIcon from '@mui/icons-material/Chat';
// import SendIcon from '@mui/icons-material/Send';

// const server_url = "http://localhost:3000";
// var connections = {};

// const peerConfigConnections = {
//     "iceServers": [
//         { "urls": "stun:stun.l.google.com:19302" }
//     ]
// }

// export default function VideoMeetComponent() {
//     const socketRef = useRef();
//     const socketIdRef = useRef();
//     const localVideoRef = useRef();
//     const videoRef = useRef([]);

//     const [videoAvailable, setVideoAvailable] = useState(true);
//     const [audioAvailable, setAudioAvailable] = useState(true);
//     const [video, setVideo] = useState(true);
//     const [audio, setAudio] = useState(true);
//     const [screen, setScreen] = useState(false);
//     const [showModel, setModel] = useState(true);
//     const [screenAvailable, setscreenAvailable] = useState();
//     const [messages, setMessages] = useState([]);
//     const [message, setMessage] = useState("");
//     const [newMessages, setNewMessages] = useState(0);
//     const [askForUsername, setAskforUsername] = useState(true);
//     const [username, setUsername] = useState("");
//     const [videos, setVideos] = useState([]);

//     useEffect(() => {
//         socketRef.current = io(server_url);
//         return () => {
//             if (socketRef.current) socketRef.current.disconnect();
//         };
//     }, []);

//     const getPermissions = async () => {
//         try {
//             const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
//             setVideoAvailable(!!videoPermission);

//             const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
//             setAudioAvailable(!!audioPermission);

//             if (navigator.mediaDevices.getDisplayMedia) {
//                 setscreenAvailable(true);
//             } else {
//                 setscreenAvailable(false);
//             }

//             if (videoAvailable || audioAvailable) {
//                 const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
//                 if (userMediaStream) {
//                     window.localStream = userMediaStream;
//                     if (localVideoRef.current) {
//                         localVideoRef.current.srcObject = userMediaStream;
//                     }
//                 }
//             }
//         } catch (err) {
//             console.log(err);
//         }
//     }

//     useEffect(() => {
//         getPermissions();
//         // eslint-disable-next-line
//     }, [])

//     let getUserMediaSuccess = (stream) => {
//         try {
//             window.localStream.getTracks().forEach(track => track.stop())
//         } catch (e) {
//             console.log(e)
//         }
//         window.localStream = stream;
//         localVideoRef.current.srcObject = stream;

//         for (let id in connections) {
//             if (id === socketIdRef.current) continue;

//             connections[id].addStream(window.localStream)

//             connections[id].createOffer().then((description) => {
//                 connections[id].setLocalDescription(description)
//                     .then(() => {
//                         socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
//                     })
//                     .catch(e => console.log(e))
//             })
//         }
//     }

//     let silence = () => {
//         let ctx = new AudioContext()
//         let oscillator = ctx.createOscillator();
//         let dst = oscillator.connect(ctx.createMediaStreamDestination());

//         oscillator.start();
//         ctx.resume()
//         return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
//     }

//     let black = ({ width = 640, height = 480 } = {}) => {
//         let canvas = Object.assign(document.createElement("canvas"), { width, height })
//         canvas.getContext('2d').fillRect(0, 0, width, height);
//         let stream = canvas.captureStream();
//         return Object.assign(stream.getVideoTracks()[0], { enabled: false })
//     }

//     let getUserMedia = () => {
//         if ((video && videoAvailable) || (audio && audioAvailable)) {
//             navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
//                 .then(getUserMediaSuccess)
//                 .then((stream) => { })
//                 .catch((e) => console.log(e))
//         } else {
//             try {
//                 let tracks = localVideoRef.current.srcObject.getTracks();
//                 tracks.forEach(track => track.stop())
//             } catch (e) { }
//         }
//     }

//     useEffect(() => {
//         if (video !== undefined && audio !== undefined) {
//             getUserMedia();
//         }
//         // eslint-disable-next-line
//     }, [audio, video])

//     let gotMessageFromServer = (fromId, message) => {
//         var signal = JSON.parse(message)

//         if (fromId !== socketIdRef.current) {
//             if (signal.sdp) {
//                 connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
//                     if (signal.sdp.type === "offer") {
//                         connections[fromId].createAnswer().then((description) => {
//                             connections[fromId].setLocalDescription(description).then(() => {
//                                 socketRef.current.emit("signal", fromId, JSON.stringify({ "sdp": connections[fromId].localDescription }))
//                             }).catch(e => console.log(e))
//                         }).catch(e => console.log(e))
//                     }
//                 }).catch(e => console.log(e))
//             }
//             if (signal.ice) {
//                 connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e));
//             }
//         }
//     }

//     let addMessage = (data, sender, socketIdSender) => {
//         setMessages((prevMessages) => [
//             ...prevMessages,
//             { sender, data }
//         ]);
//         if (socketIdRef.current && socketIdSender !== socketIdRef.current) {
//             setNewMessages((prev) => prev + 1);
//         }
//     };

//     let connectToSocketServer = () => {
//         socketRef.current.on('signal', gotMessageFromServer)
//         socketRef.current.on("connect", () => {
//             socketRef.current.emit("join-call", window.location.href)
//             socketIdRef.current = socketRef.current.id
//             socketRef.current.on('chat-message', addMessage)
//             socketRef.current.on("user-left", (id) => {
//                 setVideos((videos) => videos.filter((video) => video.socketId !== id))
//             })
//             socketRef.current.on("user-joined", (id, client) => {
//                 client.forEach((socketListId) => {
//                     connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
//                     connections[socketListId].onicecandidate = (event) => {
//                         if (event.candidate !== null) {
//                             socketRef.current.emit("signal", socketListId, JSON.stringify({ 'ice': event.candidate }))
//                         }
//                     }
//                     connections[socketListId].onaddstream = (event) => {
//                         let videoExists = videoRef.current.find(video => video.socketId === socketListId);
//                         if (videoExists) {
//                             setVideos(videos => {
//                                 const updateVideos = videos.map(video =>
//                                     video.socketId === socketListId ? { ...video, stream: event.stream } : video
//                                 );
//                                 videoRef.current = updateVideos;
//                                 return updateVideos;
//                             })
//                         } else {
//                             let newVideo = {
//                                 socketId: socketListId,
//                                 stream: event.stream,
//                                 autoplay: true,
//                                 playsinline: true
//                             }

//                             setVideos(videos => {
//                                 const updatedVideos = [...videos, newVideo];
//                                 videoRef.current = updatedVideos;
//                                 return updatedVideos;
//                             })
//                         }
//                     };

//                     if (window.localStream !== undefined && window.localStream !== null) {
//                         connections[socketListId].addStream(window.localStream);
//                     } else {
//                         let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
//                         window.localStream = blackSilence();
//                         connections[socketListId].addStream(window.localStream);
//                     }

//                 })

//                 if (id === socketIdRef.current) {
//                     for (let id2 in connections) {
//                         if (id2 === socketIdRef.current) continue

//                         try {
//                             connections[id2].addStream(window.localStream)
//                         } catch (e) {
//                             connections[id2].createOffer().then((description) => {
//                                 connections[id2].setLocalDescription(description)
//                                     .then(() => {
//                                         socketRef.current.emit("signal", id2, JSON.stringify({ "sdp": connections[id2].localDescription }))
//                                     })
//                                     .catch(e => console.log(e))
//                             })
//                         }
//                     }
//                 }
//             })
//         })
//     }

//     let getMedia = () => {
//         setVideo(videoAvailable);
//         setAudio(audioAvailable);
//     }

//     let routeTo = useNavigate();

//     let connect = () => {
//         setAskforUsername(false);
//         getMedia();
//         connectToSocketServer();
//     }

//     let handleVideo = () => {
//         setVideo(!video);
//     }

//     let handleAudio = () => {
//         setAudio(!audio);
//     }

//     let getDisplayMediaSuccess = (stream) => {
//         try {
//             window.localStream.getTracks().forEach(track => track.stop())
//         } catch (e) { console.log(e) }

//         window.localStream = stream;
//         localVideoRef.current.srcObject = stream;

//         for (let id in connections) {
//             if (id === socketIdRef.current) continue;
//             connections[id].addStream(window.localStream)
//             connections[id].createOffer().then((description) => {
//                 connections[id].setLocalDescription(description)
//                     .then(() => {
//                         socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
//                     })
//                     .catch(e => console.log(e))
//             });
//         }

//         stream.getTracks().forEach(track => track.onended = () => {
//             setScreen(false);
//             try {
//                 let tracks = localVideoRef.current.srcObject.getTracks()
//                 tracks.forEach(track => track.stop())
//             } catch (e) { console.log(e) }

//             let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
//             window.localStream = blackSilence();
//             localVideoRef.current.srcObject = window.localStream;

//             getUserMedia();
//         })
//     }

//     let getDisplayMedia = () => {
//         if (screen) {
//             if (navigator.mediaDevices.getDisplayMedia) {
//                 navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
//                     .then(getDisplayMediaSuccess)
//                     .then((stream) => { })
//                     .catch((e) => console.log(e))
//             }
//         }
//     }

//     useEffect(() => {
//         if (screen !== undefined) {
//             getDisplayMedia();
//         }
//         // eslint-disable-next-line
//     }, [screen])

//     let handleScreen = () => {
//         setScreen(!screen);
//     }

//     let sendMessage = () => {
//         if (socketRef.current) {
//             socketRef.current.emit("chat-message", message, username);
//             addMessage(message, username, socketRef.current.id);
//             setMessage("");
//         }
//     };

//     let handleEndCall = () => {
//         try {
//             let tracks = localVideoRef.current.srcObject.getTracks();
//             tracks.forEach(track => track.stop())
//         } catch (e) { }
//         routeTo('/home')
//     }

//     return (
//         <Box
//             sx={{
//                 minHeight: "100vh",
//                 background: "linear-gradient(120deg, #1976d2 0%, #42a5f5 100%)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 py: { xs: 2, sm: 4 },
//                 px: { xs: 1, sm: 2 }
//             }}
//         >
//             {askForUsername === true ? (
//                 <Paper
//                     elevation={6}
//                     sx={{
//                         p: { xs: 3, sm: 5 },
//                         borderRadius: 5,
//                         maxWidth: 400,
//                         width: "100%",
//                         mx: "auto",
//                         background: "rgba(255,255,255,0.85)",
//                         boxShadow: "0 8px 32px rgba(25,118,210,0.10)",
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                         gap: 2
//                     }}
//                 >
//                     <h2 style={{ color: "#1976d2", fontWeight: 700, marginBottom: 16 }}>Enter Lobby</h2>
//                     <TextField
//                         id="outlined-basic"
//                         label="Username"
//                         variant="outlined"
//                         value={username}
//                         onChange={e => setUsername(e.target.value)}
//                         fullWidth
//                         sx={{ mb: 2 }}
//                     />
//                     <Button
//                         variant="contained"
//                         onClick={connect}
//                         fullWidth
//                         sx={{ fontWeight: 600, py: 1.2, fontSize: "1.1rem" }}
//                     >
//                         Connect
//                     </Button>
//                     <Box sx={{ mt: 3, width: "100%", display: "flex", justifyContent: "center" }}>
//                         <video
//                             ref={localVideoRef}
//                             autoPlay
//                             muted
//                             style={{
//                                 borderRadius: 16,
//                                 boxShadow: "0 2px 16px rgba(25,118,210,0.10)",
//                                 width: "100%",
//                                 maxWidth: 320,
//                                 background: "#e3f2fd"
//                             }}
//                         ></video>
//                     </Box>
//                 </Paper>
//             ) : (
//                 <Paper
//                     elevation={8}
//                     sx={{
//                         width: "100%",
//                         maxWidth: 1200,
//                         minHeight: 600,
//                         borderRadius: 6,
//                         background: "rgba(255,255,255,0.85)",
//                         boxShadow: "0 8px 32px rgba(25,118,210,0.13)",
//                         display: "flex",
//                         flexDirection: { xs: "column", md: "row" },
//                         overflow: "hidden",
//                         position: "relative"
//                     }}
//                 >
//                     {/* Chat Sidebar */}
//                     {showModel && (
//                         <Box
//                             sx={{
//                                 width: { xs: "100%", md: 340 },
//                                 background: "rgba(227,242,253,0.95)",
//                                 borderRight: { md: "1px solid #e3f2fd" },
//                                 p: 2,
//                                 display: "flex",
//                                 flexDirection: "column",
//                                 justifyContent: "space-between",
//                                 minHeight: { xs: 220, md: "100%" }
//                             }}
//                         >
//                             <Typography variant="h6" sx={{ color: "#1976d2", fontWeight: 700, mb: 1 }}>
//                                 Chat
//                             </Typography>
//                             <Box
//                                 sx={{
//                                     flex: 1,
//                                     overflowY: "auto",
//                                     mb: 2,
//                                     background: "#fff",
//                                     borderRadius: 2,
//                                     p: 1,
//                                     boxShadow: "0 1px 6px rgba(25,118,210,0.05)"
//                                 }}
//                             >
//                                 {messages.map((item, index) => (
//                                     <div key={index} style={{ marginBottom: 8 }}>
//                                         <strong style={{ color: "#1976d2" }}>{item.sender}:</strong> {item.data}
//                                     </div>
//                                 ))}
//                             </Box>
//                             <Box sx={{ display: "flex", gap: 1 }}>
//                                 <TextField
//                                     value={message}
//                                     onChange={e => setMessage(e.target.value)}
//                                     id='outlined-basic'
//                                     label='Enter Your Chat'
//                                     variant="outlined"
//                                     size="small"
//                                     sx={{ flex: 1 }}
//                                 />
//                                 <IconButton color="primary" onClick={sendMessage}>
//                                     <SendIcon />
//                                 </IconButton>
//                             </Box>
//                         </Box>
//                     )}

//                     {/* Main Video Area */}
//                     <Box
//                         sx={{
//                             flex: 1,
//                             display: "flex",
//                             flexDirection: "column",
//                             alignItems: "center",
//                             justifyContent: "space-between",
//                             p: { xs: 2, md: 4 },
//                             position: "relative"
//                         }}
//                     >
//                         {/* Local Video */}
//                         <Box
//                             sx={{
//                                 width: "100%",
//                                 display: "flex",
//                                 justifyContent: "center",
//                                 mb: 2
//                             }}
//                         >
//                             <video
//                                 className={styles.meetUserVideo}
//                                 ref={localVideoRef}
//                                 autoPlay
//                                 muted
//                                 style={{
//                                     borderRadius: 16,
//                                     boxShadow: "0 2px 16px rgba(25,118,210,0.10)",
//                                     width: "100%",
//                                     maxWidth: 400,
//                                     background: "#e3f2fd"
//                                 }}
//                             ></video>
//                         </Box>

//                         {/* Remote Videos */}
//                         <Box
//                             className={styles.conferenceView}
//                             sx={{
//                                 width: "100%",
//                                 display: "flex",
//                                 flexWrap: "wrap",
//                                 gap: 2,
//                                 justifyContent: "center"
//                             }}
//                         >
//                             {videos.map((video) => (
//                                 <Box key={video.socketId} sx={{ minWidth: 180, maxWidth: 320 }}>
//                                     <video
//                                         data-socket={video.socketId}
//                                         ref={ref => {
//                                             if (ref && video.stream) {
//                                                 ref.srcObject = video.stream;
//                                             }
//                                         }}
//                                         autoPlay
//                                         style={{
//                                             borderRadius: 12,
//                                             width: "100%",
//                                             background: "#e3f2fd",
//                                             boxShadow: "0 2px 12px rgba(25,118,210,0.08)"
//                                         }}
//                                     ></video>
//                                 </Box>
//                             ))}
//                         </Box>

//                         {/* Controls at the bottom */}
//                         <Box
//                             sx={{
//                                 position: "absolute",
//                                 left: "50%",
//                                 bottom: 32,
//                                 transform: "translateX(-50%)",
//                                 display: "flex",
//                                 gap: 2,
//                                 background: "rgba(255,255,255,0.85)",
//                                 borderRadius: 999,
//                                 boxShadow: "0 2px 16px rgba(25,118,210,0.10)",
//                                 p: 1.5,
//                                 zIndex: 10
//                             }}
//                         >
//                             <IconButton onClick={handleScreen} color="primary" sx={{ bgcolor: "#e3f2fd" }}>
//                                 {screenAvailable === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
//                             </IconButton>
//                             <IconButton onClick={handleVideo} color="primary" sx={{ bgcolor: "#e3f2fd" }}>
//                                 {video === true ? <VideocamIcon /> : <VideocamOffIcon />}
//                             </IconButton>
//                             <IconButton onClick={handleEndCall} sx={{ bgcolor: "#ff5252", color: "#fff", mx: 1, "&:hover": { bgcolor: "#d32f2f" } }}>
//                                 <CallEndIcon />
//                             </IconButton>
//                             <IconButton onClick={handleAudio} color="primary" sx={{ bgcolor: "#e3f2fd" }}>
//                                 {audio === true ? <MicIcon /> : <MicOffIcon />}
//                             </IconButton>
//                             <Badge badgeContent={newMessages} max={999} color='secondary'>
//                                 <IconButton color="primary" sx={{ bgcolor: "#e3f2fd" }} onClick={() => setModel(!showModel)}>
//                                     <ChatIcon />
//                                 </IconButton>
//                             </Badge>
//                         </Box>
//                     </Box>
//                 </Paper>
//             )}
//         </Box>
//     );
// }
import { io } from "socket.io-client";
import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { IconButton, TextField, Button, Paper, Box, Badge, Typography } from '@mui/material';
import styles from "../styles/VideoComponent.module.css"
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';

const server_url = "http://192.168.1.5:8000";
var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default function VideoMeetComponent() {
    const socketRef = useRef();
    const socketIdRef = useRef();
    const localVideoRef = useRef();
    const videoRef = useRef([]);

    const [videoAvailable, setVideoAvailable] = useState(true);
    const [audioAvailable, setAudioAvailable] = useState(true);
    const [video, setVideo] = useState(true);
    const [audio, setAudio] = useState(true);
    const [screen, setScreen] = useState(false);
    const [showModel, setModel] = useState(true);
    const [screenAvailable, setscreenAvailable] = useState();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [newMessages, setNewMessages] = useState(0);
    const [askForUsername, setAskforUsername] = useState(true);
    const [username, setUsername] = useState("");
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        socketRef.current = io(server_url);
        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, []);

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            setVideoAvailable(!!videoPermission);

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            setAudioAvailable(!!audioPermission);

            if (navigator.mediaDevices.getDisplayMedia) {
                setscreenAvailable(true);
            } else {
                setscreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getPermissions();
        // eslint-disable-next-line
    }, [])

    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) {
            console.log(e)
        }
        window.localStream = stream;
        localVideoRef.current.srcObject = stream;

        for (let id in connections) {
            if (id === socketIdRef.current) continue;

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator();
        let dst = oscillator.connect(ctx.createMediaStreamDestination());

        oscillator.start();
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }

    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height);
        let stream = canvas.captureStream();
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
        }
        // eslint-disable-next-line
    }, [audio, video])

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === "offer") {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit("signal", fromId, JSON.stringify({ "sdp": connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }
            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e));
            }
        }
    }

    let addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender, data }
        ]);
        if (socketIdRef.current && socketIdSender !== socketIdRef.current) {
            setNewMessages((prev) => prev + 1);
        }
    };

    let connectToSocketServer = () => {
        socketRef.current.on('signal', gotMessageFromServer)
        socketRef.current.on("connect", () => {
            socketRef.current.emit("join-call", window.location.href)
            socketIdRef.current = socketRef.current.id
            socketRef.current.on('chat-message', addMessage)
            socketRef.current.on("user-left", (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })
            socketRef.current.on("user-joined", (id, client) => {
                client.forEach((socketListId) => {
                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
                    connections[socketListId].onicecandidate = (event) => {
                        if (event.candidate !== null) {
                            socketRef.current.emit("signal", socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }
                    connections[socketListId].onaddstream = (event) => {
                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);
                        if (videoExists) {
                            setVideos(videos => {
                                const updateVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updateVideos;
                                return updateVideos;
                            })
                        } else {
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            }

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            })
                        }
                    };

                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream);
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
                        window.localStream = blackSilence();
                        connections[socketListId].addStream(window.localStream);
                    }

                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            connections[id2].addStream(window.localStream)
                        } catch (e) {
                            connections[id2].createOffer().then((description) => {
                                connections[id2].setLocalDescription(description)
                                    .then(() => {
                                        socketRef.current.emit("signal", id2, JSON.stringify({ "sdp": connections[id2].localDescription }))
                                    })
                                    .catch(e => console.log(e))
                            })
                        }
                    }
                }
            })
        })
    }

    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
    }

    let routeTo = useNavigate();

    let connect = () => {
        setAskforUsername(false);
        getMedia();
        connectToSocketServer();
    }

    let handleVideo = () => {
        setVideo(!video);
    }

    let handleAudio = () => {
        setAudio(!audio);
    }

    let getDisplayMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream;
        localVideoRef.current.srcObject = stream;

        for (let id in connections) {
            if (id === socketIdRef.current) continue;
            connections[id].addStream(window.localStream)
            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            });
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false);
            try {
                let tracks = localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            localVideoRef.current.srcObject = window.localStream;

            getUserMedia();
        })
    }

    let getDisplayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDisplayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDisplayMedia();
        }
        // eslint-disable-next-line
    }, [screen])

    let handleScreen = () => {
        setScreen(!screen);
    }

    let sendMessage = () => {
        if (socketRef.current) {
            socketRef.current.emit("chat-message", message, username);
            addMessage(message, username, socketRef.current.id);
            setMessage("");
        }
    };

    let handleEndCall = () => {
        try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop())
        } catch (e) { }
        routeTo('/home')
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(120deg, #1976d2 0%, #42a5f5 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: { xs: 2, sm: 4 },
                px: { xs: 1, sm: 2 }
            }}
        >
            {askForUsername === true ? (
                <Paper
                    elevation={6}
                    sx={{
                        p: { xs: 3, sm: 5 },
                        borderRadius: 5,
                        maxWidth: 400,
                        width: "100%",
                        mx: "auto",
                        background: "rgba(255,255,255,0.85)",
                        boxShadow: "0 8px 32px rgba(25,118,210,0.10)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2
                    }}
                >
                    <h2 style={{ color: "#1976d2", fontWeight: 700, marginBottom: 16 }}>Enter Lobby</h2>
                    <TextField
                        id="outlined-basic"
                        label="Username"
                        variant="outlined"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        onClick={connect}
                        fullWidth
                        sx={{ fontWeight: 600, py: 1.2, fontSize: "1.1rem" }}
                    >
                        Connect
                    </Button>
                    <Box sx={{ mt: 3, width: "100%", display: "flex", justifyContent: "center" }}>
                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            style={{
                                borderRadius: 16,
                                boxShadow: "0 2px 16px rgba(25,118,210,0.10)",
                                width: "100%",
                                maxWidth: 320,
                                background: "#e3f2fd"
                            }}
                        ></video>
                    </Box>
                </Paper>
            ) : (
                <Paper
                    elevation={8}
                    sx={{
                        width: "100%",
                        maxWidth: 1200,
                        minHeight: 600,
                        borderRadius: 6,
                        background: "rgba(255,255,255,0.85)",
                        boxShadow: "0 8px 32px rgba(25,118,210,0.13)",
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        overflow: "hidden",
                        position: "relative"
                    }}
                >
                    {/* Chat Sidebar */}
                    {showModel && (
                        <Box
                            sx={{
                                width: { xs: "100%", md: 340 },
                                background: "rgba(227,242,253,0.95)",
                                borderRight: { md: "1px solid #e3f2fd" },
                                p: 2,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                minHeight: { xs: 220, md: "100%" }
                            }}
                        >
                            <Typography variant="h6" sx={{ color: "#1976d2", fontWeight: 700, mb: 1 }}>
                                Chat
                            </Typography>
                            <Box
                                sx={{
                                    flex: 1,
                                    overflowY: "auto",
                                    mb: 2,
                                    background: "#fff",
                                    borderRadius: 2,
                                    p: 1,
                                    boxShadow: "0 1px 6px rgba(25,118,210,0.05)"
                                }}
                            >
                                {messages.map((item, index) => (
                                    <div key={index} style={{ marginBottom: 8 }}>
                                        <strong style={{ color: "#1976d2" }}>{item.sender}:</strong> {item.data}
                                    </div>
                                ))}
                            </Box>
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <TextField
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    id='outlined-basic'
                                    label='Enter Your Chat'
                                    variant="outlined"
                                    size="small"
                                    sx={{ flex: 1 }}
                                />
                                <IconButton color="primary" onClick={sendMessage}>
                                    <SendIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    )}

                    {/* Main Video Area */}
                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "space-between",
                            p: { xs: 2, md: 4 },
                            position: "relative"
                        }}
                    >
                        {/* Local Video */}
                        <Box
                            sx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                mb: 2
                            }}
                        >
                            <video
                                className={styles.meetUserVideo}
                                ref={localVideoRef}
                                autoPlay
                                muted
                                style={{
                                    borderRadius: 16,
                                    boxShadow: "0 2px 16px rgba(25,118,210,0.10)",
                                    width: "100%",
                                    maxWidth: 400,
                                    background: "#e3f2fd"
                                }}
                            ></video>
                        </Box>

                        {/* Remote Videos */}
                        <Box
                            className={styles.conferenceView}
                            sx={{
                                width: "100%",
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 2,
                                justifyContent: "center"
                            }}
                        >
                            {videos.map((video) => (
                                <Box key={video.socketId} sx={{ minWidth: 180, maxWidth: 320 }}>
                                    <video
                                        data-socket={video.socketId}
                                        ref={ref => {
                                            if (ref && video.stream) {
                                                ref.srcObject = video.stream;
                                            }
                                        }}
                                        autoPlay
                                        style={{
                                            borderRadius: 12,
                                            width: "100%",
                                            background: "#e3f2fd",
                                            boxShadow: "0 2px 12px rgba(25,118,210,0.08)"
                                        }}
                                    ></video>
                                </Box>
                            ))}
                        </Box>

                        {/* Controls at the bottom */}
                        <Box
                            sx={{
                                position: "absolute",
                                left: "50%",
                                bottom: 6,
                                transform: "translateX(-50%)",
                                display: "flex",
                                gap: 2,
                                background: "rgba(255,255,255,0.85)",
                                borderRadius: 999,
                                boxShadow: "0 2px 16px rgba(25,118,210,0.10)",
                                p: 1,
                                zIndex: 10
                            }}
                        >
                            <IconButton onClick={handleScreen} color="primary" sx={{ bgcolor: "#e3f2fd" }}>
                                {screenAvailable === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                            </IconButton>
                            
                            <IconButton onClick={handleVideo} color="primary" sx={{ bgcolor: "#e3f2fd" }}>
                                {video === true ? <VideocamIcon /> : <VideocamOffIcon />}
                            </IconButton>
                            <IconButton onClick={handleEndCall} sx={{ bgcolor: "#ff5252", color: "#fff", mx: 1, "&:hover": { bgcolor: "#d32f2f" } }}>
                                <CallEndIcon />
                            </IconButton>
                            <IconButton onClick={handleAudio} color="primary" sx={{ bgcolor: "#e3f2fd" }}>
                                {audio === true ? <MicIcon /> : <MicOffIcon />}
                            </IconButton>
                            <Badge badgeContent={newMessages} max={999} color='secondary'>
                                <IconButton color="primary" sx={{ bgcolor: "#e3f2fd" }} onClick={() => setModel(!showModel)}>
                                    <ChatIcon />
                                </IconButton>
                            </Badge>
                        </Box>
                    </Box>
                </Paper>
            )}
        </Box>
    );
}