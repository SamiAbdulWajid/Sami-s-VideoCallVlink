import React, { useState, useContext } from 'react';
import withAuth from '../utils/withAuth';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import RestoreIcon from '@mui/icons-material/Restore';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { AuthContext } from '../contexts/AuthContext';
import "../App.css";

function HomeComponent() {
    const [meetingCode, setMeetingCode] = useState("");
    const navigate = useNavigate();
    const { addToHistory } = useContext(AuthContext);

    let handleJoinVideoCall = async () => {
        if (meetingCode.trim()) {
            await addToHistory(meetingCode);
            navigate(`/${meetingCode}`);
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", background: "#f5f6fa" }}>
            {/* NavBar */}
            <Box
                className="navBar"
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    padding: { xs: "12px 16px", sm: "18px 40px" },
                    background: "#fff",
                    borderBottom: "1px solid #e0e0e0",
                    gap: { xs: 2, sm: 0 }
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: "bold",
                        color: "#1976d2",
                        fontSize: { xs: "1.3rem", sm: "2rem" },
                        mb: { xs: 1, sm: 0 }
                    }}
                >
                    Vlink Video Call
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: { xs: 1, sm: 0 } }}>
                    <IconButton onClick={() => navigate("/history")}>
                        <RestoreIcon />
                        <Typography sx={{ ml: 1, display: { xs: "none", sm: "inline" } }}>History</Typography>
                    </IconButton>
                    <Button
                        onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/auth");
                        }}
                        variant="outlined"
                        sx={{ ml: 2 }}
                    >
                        Logout
                    </Button>
                </Box>
            </Box>

            {/* Main Content */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "calc(100vh - 80px)",
                    background: "#f5f6fa",
                    px: { xs: 1, sm: 0 }
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        maxWidth: 900,
                        width: "100%",
                        p: { xs: 2, sm: 4 },
                        borderRadius: 4,
                        alignItems: "center",
                        gap: { xs: 3, md: 6 }
                    }}
                >
                    {/* Left Panel */}
                    <Box sx={{ flex: 1, width: "100%" }}>
                        <Typography
                            variant="h4"
                            sx={{
                                mb: 2,
                                color: "#1976d2",
                                fontSize: { xs: "1.5rem", sm: "2.125rem" }
                            }}
                        >
                            Providing Quality Video Call
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                gap: 2,
                                mb: 2
                            }}
                        >
                            <TextField
                                onChange={e => setMeetingCode(e.target.value)}
                                id="outlined-basic"
                                label="Meeting Code"
                                variant="outlined"
                                size="small"
                                sx={{ flex: 1 }}
                                value={meetingCode}
                                autoFocus
                            />
                            <Button
                                onClick={handleJoinVideoCall}
                                variant="contained"
                                size="large"
                                sx={{
                                    minWidth: { xs: "100%", sm: 120 },
                                    mt: { xs: 1, sm: 0 }
                                }}
                                disabled={!meetingCode.trim()}
                            >
                                Join Call
                            </Button>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            Enter a meeting code to join or start a call.
                        </Typography>
                    </Box>
                    {/* Right Panel */}
                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                            mt: { xs: 2, md: 0 }
                        }}
                    >
                        <img
                            src="/phoneimage.png"
                            alt="Video Call"
                            className="phoneimage"
                            style={{
                                maxWidth: "100%",
                                width: "100%",
                                maxHeight: 340,
                                borderRadius: 12,
                                boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
                                objectFit: "cover"
                            }}
                        />
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}

export default withAuth(HomeComponent);