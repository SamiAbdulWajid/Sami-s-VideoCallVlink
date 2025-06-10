// import React ,{useContext,useEffect,useState} from 'react';
// import { AuthContext } from '../contexts/AuthContext';
// // import { getUserHistory } from '../../../backend/src/controllers/user.controllers';
// import  Card  from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent'
// import  Typography  from '@mui/material/Typography';
// import  CardActions  from '@mui/material/CardActions';
// import  Box  from '@mui/material/Box';
// import  Button  from '@mui/material/Button';
//   import { useNavigate } from 'react-router-dom';

// export default function History(){
  
//     const  {getHistoryOfUser} =useContext(AuthContext);
//     const [meetings,setMeetings]=useState([]);
//     const routeTo=useNavigate();

//     useEffect(()=>{
//         const fetchHistory=async()=>{
//             try{
//                 const history=await getHistoryOfUser();
//                 setMeetings(history);
//             }catch(err){
//                 throw err;
//             }
//         }
//         fetchHistory();
//     })

//     const card = (
//   <React.Fragment>
//     <CardContent>
//       <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
//         Word of the Day
//       </Typography>
//      <Typography variant="h5" component="div">
//   be&nbsp;&bull;&nbsp;nev&nbsp;&bull;&nbsp;o&nbsp;&bull;&nbsp;lent
// </Typography>
//       <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>adjective</Typography>
//       <Typography variant="body2">
//         well meaning and kindly.
//         <br />
//         {'"a benevolent smile"'}
//       </Typography>
//     </CardContent>
//     <CardActions>
//       <Button size="small">Learn More</Button>
//     </CardActions>
//   </React.Fragment>
// );

//     return (
//        <div>
//         {
//             meetings.map(e=>{
//                 return (
//                     <>
//                     <Card variant="outlined">{card}


//                     </Card>
//                     </>
//                 )
//             })
//         }
//        </div>
//     );
// }


import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(Array.isArray(history) ? history : []);
            } catch (err) {
                setMeetings([]); // fallback to empty array on error
            }
        };
        fetchHistory();
    }, [getHistoryOfUser]);

    return (
        <Box sx={{ minHeight: "100vh", background: "#f5f6fa", p: { xs: 1, sm: 4 } }}>
            <Typography variant="h4" sx={{ mb: 4, color: "#1976d2", textAlign: "center" }}>
                Meeting History
            </Typography>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                maxWidth: 600,
                margin: "0 auto"
            }}>
                {meetings.length === 0 ? (
                    <Typography color="text.secondary">No meeting history found.</Typography>
                ) : (
                    meetings.map((meeting, idx) => (
                        <Card variant="outlined" key={meeting._id || meeting.meeting_code || idx} sx={{ width: "100%" }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ color: "#1976d2" }}>
                                    Meeting Code: {meeting.meeting_code}
                                </Typography>
                                <Typography sx={{ color: 'text.secondary', mb: 1 }}>
                                    User: {meeting.user_id}
                                </Typography>
                                <Typography sx={{ color: 'text.secondary', mb: 1 }}>
                                    Date: {meeting.createdAt ? new Date(meeting.createdAt).toLocaleString() : "N/A"}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => routeTo(`/${meeting.meeting_code}`)}
                                >
                                    Rejoin
                                </Button>
                            </CardActions>
                        </Card>
                    ))
                )}
            </Box>
        </Box>
    );
}