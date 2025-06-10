
// import * as React from 'react';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
// import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
// import Paper from '@mui/material/Paper';
// import Box from '@mui/material/Box';
// import Grid from '@mui/material/Grid';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import Typography from '@mui/material/Typography';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { AuthContext } from '../contexts/AuthContext';
// import { Snackbar } from '@mui/material';



// // TODO remove, this demo shouldn't need to reset the theme.

// const defaultTheme = createTheme();

// export default function Authentication() {
  
//   const [username,setUsername]=React.useState();
//   const [password,setPassword]=React.useState();
//   const [name,setName]=React.useState();
//   const [error,setError]=React.useState();
//   const [messages,setMessages]=React.useState();
//   const [formState,setformState]=React.useState(0);
//   const [open,setOpen]=React.useState(false);

//   const {handleRegister,handleLogin}=React.useContext(AuthContext);
//   let handleAuth=async()=>{
//     try {
//       if(formState ===0){
// let result = await handleLogin(username, password);
//       console.log(result);
//       setMessages(result);
//       setOpen(true);
//       }

//       if(formState ===1){
// let result=await handleRegister(name,username,password);
// console.log(result);
// setUsername("");
// setMessages(result);
// setOpen(true);
// setError("");
// setformState(0);
// setPassword("");
//       }
//     } catch (error) {
//      let messages =
//     error?.response?.data?.messages ||
//     error?.response?.data?.message ||
//     error?.message ||
//     "An error occurred";
//   setError(messages);
//     }
//   }

//   return (
//     <ThemeProvider theme={defaultTheme}>
//       <Grid container component="main" sx={{ height: '100vh' }}>
//         <CssBaseline />
//         <Grid
//           item
//           xs={false}
//           sm={4}
//           md={7}
//           sx={{
//             backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
//             backgroundRepeat: 'no-repeat',
//             backgroundColor: (t) =>
//               t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//           }}
//         />
//         <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
//           <Box
//             sx={{
//               my: 8,
//               mx: 4,
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//             }}
//           >
//             <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
//               <LockOutlinedIcon />
//             </Avatar>

//             <div>
//                <Button variant={formState === 0 ? "contained" :""} onClick={()=>{setformState(0)}}>Sign in</Button>
                
//                <Button variant={formState === 1 ? "contained" :""} onClick={()=>{setformState(1)}}>Sign up</Button>
//             </div>
            
//             <Box component="form" noValidate  sx={{ mt: 1 }}>

//               {formState ===1 ?<TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="username"
//                 label="Full Name"
//                 name="username"
//                 value={name} 
//                 autoFocus
//                 onChange={(e)=>setName(e.target.value)}
//               /> : <></>}
              
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="username"
//                 label="Username"
//                 name="username" 
//                 value={username}
//                 autoFocus
//                 onChange={(e)=>setUsername(e.target.value)}
//               />
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 name="password"
//                 label="Password"
//                 value={password}
//                 type="password"
//                 id="password"
//                 onChange={(e)=>setPassword(e.target.value)}
//               />
//              <p style={{color:"red"}}>{error}</p>
//               <Button
//                 type="button"
//                 fullWidth
//                 variant="contained"
//                 sx={{ mt: 3, mb: 2 }}
//                 onClick={handleAuth}
//               >
//                 {formState === 0 ? "Login":"Register"}
               
//               </Button>
             
          
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>
//       <Snackbar open={open}
//       autoHideDuration={4000}
//       message={messages}/>
//     </ThemeProvider>
//   );
// }

// import React, { useContext, useEffect, useState } from 'react';
// import { AuthContext } from '../contexts/AuthContext';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import Typography from '@mui/material/Typography';
// import CardActions from '@mui/material/CardActions';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import { useNavigate } from 'react-router-dom';

// export default function History() {
//     const { getHistoryOfUser } = useContext(AuthContext);
//     const [meetings, setMeetings] = useState([]);
//     const routeTo = useNavigate();

//     useEffect(() => {
//         const fetchHistory = async () => {
//             try {
//                 const history = await getHistoryOfUser();
//                 setMeetings(Array.isArray(history) ? history : []);
//             } catch (err) {
//                 setMeetings([]); // fallback to empty array on error
//             }
//         };
//         fetchHistory();
//     }, [getHistoryOfUser]);

//     return (
//         <Box sx={{ minHeight: "100vh", background: "#f5f6fa", p: { xs: 1, sm: 4 } }}>
//             <Typography variant="h4" sx={{ mb: 4, color: "#1976d2", textAlign: "center" }}>
//                 Meeting History
//             </Typography>
//             <Box sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 gap: 3,
//                 maxWidth: 600,
//                 margin: "0 auto"
//             }}>
//                 {meetings.length === 0 ? (
//                     <Typography color="text.secondary">No meeting history found.</Typography>
//                 ) : (
//                     meetings.map((meeting, idx) => (
//                         <Card variant="outlined" key={meeting._id || meeting.meeting_code || idx} sx={{ width: "100%" }}>
//                             <CardContent>
//                                 <Typography variant="h6" sx={{ color: "#1976d2" }}>
//                                     Meeting Code: {meeting.meeting_code}
//                                 </Typography>
//                                 <Typography sx={{ color: 'text.secondary', mb: 1 }}>
//                                     User: {meeting.user_id}
//                                 </Typography>
//                                 <Typography sx={{ color: 'text.secondary', mb: 1 }}>
//                                     Date: {meeting.createdAt ? new Date(meeting.createdAt).toLocaleString() : "N/A"}
//                                 </Typography>
//                             </CardContent>
//                             <CardActions>
//                                 <Button
//                                     size="small"
//                                     variant="contained"
//                                     onClick={() => routeTo(`/${meeting.meeting_code}`)}
//                                 >
//                                     Rejoin
//                                 </Button>
//                             </CardActions>
//                         </Card>
//                     ))
//                 )}
//             </Box>
//         </Box>
//     );
// }

// import * as React from 'react';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
// import TextField from '@mui/material/TextField';
// import Paper from '@mui/material/Paper';
// import Box from '@mui/material/Box';
// import Grid from '@mui/material/Grid';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import Typography from '@mui/material/Typography';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { AuthContext } from '../contexts/AuthContext';
// import { Snackbar } from '@mui/material';

// const defaultTheme = createTheme();

// export default function Authentication() {
//   const [username, setUsername] = React.useState("");
//   const [password, setPassword] = React.useState("");
//   const [name, setName] = React.useState("");
//   const [error, setError] = React.useState("");
//   const [messages, setMessages] = React.useState("");
//   const [formState, setformState] = React.useState(0);
//   const [open, setOpen] = React.useState(false);

//   const { handleRegister, handleLogin } = React.useContext(AuthContext);

//   let handleAuth = async () => {
//     try {
//       if (formState === 0) {
//         let result = await handleLogin(username, password);
//         setMessages(result);
//         setOpen(true);
//       }
//       if (formState === 1) {
//         let result = await handleRegister(name, username, password);
//         setUsername("");
//         setMessages(result);
//         setOpen(true);
//         setError("");
//         setformState(0);
//         setPassword("");
//       }
//     } catch (error) {
//       let messages =
//         error?.response?.data?.messages ||
//         error?.response?.data?.message ||
//         error?.message ||
//         "An error occurred";
//       setError(messages);
//     }
//   };

//   return (
//     <ThemeProvider theme={defaultTheme}>
//       <Grid container component="main" sx={{ minHeight: '100vh' }}>
//         <CssBaseline />
//         {/* Left Side: Custom Image with Gradient Overlay */}
//         <Grid
//           item
//           xs={false}
//           sm={5}
//           md={7}
//           sx={{
//             position: 'relative',
//             display: { xs: 'none', sm: 'block' },
//             background: 'linear-gradient(120deg, #e3f2fd 0%, #fff 100%)',
//           }}
//         >
//           <Box
//             sx={{
//               width: '100%',
//               height: '100%',
//               minHeight: '100vh',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               position: 'relative',
//               overflow: 'hidden',
//             }}
//           >
//             <img
//               src="/phoneimage.png"
//               alt="Video Call"
//               style={{
//                 width: '80%',
//                 maxWidth: 420,
//                 minWidth: 260,
//                 borderRadius: 32,
//                 boxShadow: '0 8px 40px rgba(25, 118, 210, 0.18)',
//                 objectFit: 'cover',
//                 zIndex: 2,
//               }}
//             />
//             {/* Subtle overlay for effect */}
//             <Box
//               sx={{
//                 position: 'absolute',
//                 top: 0,
//                 left: 0,
//                 width: '100%',
//                 height: '100%',
//                 background: 'linear-gradient(120deg, rgba(25,118,210,0.08) 0%, rgba(255,255,255,0.4) 100%)',
//                 zIndex: 1,
//               }}
//             />
//             {/* Optional: Add a headline or tagline */}
//             <Typography
//               variant="h4"
//               sx={{
//                 position: 'absolute',
//                 bottom: 48,
//                 left: 0,
//                 width: '100%',
//                 textAlign: 'center',
//                 color: '#1976d2',
//                 fontWeight: 700,
//                 letterSpacing: 1,
//                 zIndex: 3,
//                 textShadow: '0 2px 12px rgba(0,0,0,0.08)'
//               }}
//             >
//               Connect. Meet. Share.
//             </Typography>
//           </Box>
//         </Grid>
//         {/* Right Side: Form */}
//         <Grid item xs={12} sm={7} md={5} component={Paper} elevation={6} square>
//           <Box
//             sx={{
//               my: { xs: 4, sm: 8 },
//               mx: { xs: 2, sm: 4 },
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               minHeight: { xs: '100vh', sm: 'auto' },
//               justifyContent: { xs: 'center', sm: 'flex-start' },
//             }}
//           >
//             <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 56, height: 56 }}>
//               <LockOutlinedIcon fontSize="large" />
//             </Avatar>
//             <Typography component="h1" variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
//               {formState === 0 ? "Sign In to Vlink" : "Create your Vlink Account"}
//             </Typography>
//             <Box sx={{ mb: 2 }}>
//               <Button
//                 variant={formState === 0 ? "contained" : "outlined"}
//                 onClick={() => setformState(0)}
//                 sx={{ mr: 1, minWidth: 110 }}
//               >
//                 Sign in
//               </Button>
//               <Button
//                 variant={formState === 1 ? "contained" : "outlined"}
//                 onClick={() => setformState(1)}
//                 sx={{ minWidth: 110 }}
//               >
//                 Sign up
//               </Button>
//             </Box>
//             <Box component="form" noValidate sx={{ mt: 1, width: '100%', maxWidth: 380 }}>
//               {formState === 1 ? (
//                 <TextField
//                   margin="normal"
//                   required
//                   fullWidth
//                   id="fullname"
//                   label="Full Name"
//                   name="fullname"
//                   value={name}
//                   autoFocus
//                   onChange={(e) => setName(e.target.value)}
//                 />
//               ) : null}
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="username"
//                 label="Username"
//                 name="username"
//                 value={username}
//                 autoFocus={formState === 0}
//                 onChange={(e) => setUsername(e.target.value)}
//               />
//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 name="password"
//                 label="Password"
//                 value={password}
//                 type="password"
//                 id="password"
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <Typography sx={{ color: "red", mt: 1, minHeight: 24 }}>{error}</Typography>
//               <Button
//                 type="button"
//                 fullWidth
//                 variant="contained"
//                 sx={{ mt: 3, mb: 2, py: 1.2, fontWeight: 600, fontSize: "1.1rem" }}
//                 onClick={handleAuth}
//               >
//                 {formState === 0 ? "Login" : "Register"}
//               </Button>
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>
//       <Snackbar
//         open={open}
//         autoHideDuration={4000}
//         message={messages}
//         onClose={() => setOpen(false)}
//       />
//     </ThemeProvider>
//   );
// }

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar } from '@mui/material';

const defaultTheme = createTheme();

export default function Authentication() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");
  const [messages, setMessages] = React.useState("");
  const [formState, setformState] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const { handleRegister, handleLogin } = React.useContext(AuthContext);

  let handleAuth = async () => {
    try {
      if (formState === 0) {
        let result = await handleLogin(username, password);
        setMessages(result);
        setOpen(true);
      }
      if (formState === 1) {
        let result = await handleRegister(name, username, password);
        setUsername("");
        setMessages(result);
        setOpen(true);
        setError("");
        setformState(0);
        setPassword("");
      }
    } catch (error) {
      let messages =
        error?.response?.data?.messages ||
        error?.response?.data?.message ||
        error?.message ||
        "An error occurred";
      setError(messages);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ minHeight: '100vh' }}>
        <CssBaseline />
        {/* Left Side: Custom Image with Gradient Overlay */}
        <Grid
          item
          xs={false}
          sm={5}
          md={7}
          sx={{
            position: 'relative',
            display: { xs: 'none', sm: 'block' },
            background: 'linear-gradient(120deg, #e3f2fd 0%, #fff 100%)',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <img
              src="/phoneimage.png"
              alt="Video Call"
              style={{
                width: '80%',
                maxWidth: 420,
                minWidth: 260,
                borderRadius: 32,
                boxShadow: '0 8px 40px rgba(25, 118, 210, 0.18)',
                objectFit: 'cover',
                zIndex: 2,
              }}
            />
            {/* Subtle overlay for effect */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(120deg, rgba(25,118,210,0.08) 0%, rgba(255,255,255,0.4) 100%)',
                zIndex: 1,
              }}
            />
            {/* Optional: Add a headline or tagline */}
            <Typography
              variant="h4"
              sx={{
                position: 'absolute',
                bottom: 48,
                left: 0,
                width: '100%',
                textAlign: 'center',
                color: '#1976d2',
                fontWeight: 700,
                letterSpacing: 1,
                zIndex: 3,
                textShadow: '0 2px 12px rgba(0,0,0,0.08)'
              }}
            >
              Connect. Meet. Share.
            </Typography>
          </Box>
        </Grid>
        {/* Right Side: Form */}
        <Grid item xs={12} sm={7} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: { xs: 4, sm: 8 },
              mx: { xs: 2, sm: 4 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minHeight: { xs: '100vh', sm: 'auto' },
              justifyContent: { xs: 'center', sm: 'flex-start' },
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 56, height: 56 }}>
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              {formState === 0 ? "Sign In to Vlink" : "Create your Vlink Account"}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Button
                variant={formState === 0 ? "contained" : "outlined"}
                onClick={() => setformState(0)}
                sx={{ mr: 1, minWidth: 110 }}
              >
                Sign in
              </Button>
              <Button
                variant={formState === 1 ? "contained" : "outlined"}
                onClick={() => setformState(1)}
                sx={{ minWidth: 110 }}
              >
                Sign up
              </Button>
            </Box>
            <Box component="form" noValidate sx={{ mt: 1, width: '100%', maxWidth: 380 }}>
              {formState === 1 ? (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="fullname"
                  label="Full Name"
                  name="fullname"
                  value={name}
                  autoFocus
                  onChange={(e) => setName(e.target.value)}
                />
              ) : null}
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                value={username}
                autoFocus={formState === 0}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                value={password}
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Typography sx={{ color: "red", mt: 1, minHeight: 24 }}>{error}</Typography>
              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.2, fontWeight: 600, fontSize: "1.1rem" }}
                onClick={handleAuth}
              >
                {formState === 0 ? "Login" : "Register"}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        message={messages}
        onClose={() => setOpen(false)}
      />
    </ThemeProvider>
  );
}