import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import httpStatus from "http-status";
import axios from "axios";


export const AuthContext=createContext({});

const client=axios.create({
    baseURL:"http://localhost:8000/api/v1/users"
})

export const AuthProvider=({children})=>{
    const authContext=useContext(AuthContext);

    const[userData,setUserData]=useState(authContext);

    const handleRegister=async(name,username,password)=>{
        try{
            let request=await client.post("/register",{
                name:name,
                username:username,
                password:password
            })

            if(request.status === httpStatus.CREATED){
                return request.data.message;
            }
        }catch(err){
        throw err;
    }

    }

    // const handleLogin=async (username,password)=>{
    //     try {
    //         let request=await client.post("/login",{
    //             username:username,
    //             password:password
    //         });

    //         if(request.status === httpStatus.OK){
    //             localStorage.setItem("token",request.data.token);
    //             // router("/home")
    //         }
    //     } catch (error) {
    //         throw error;    
    //     }
    // }
    // const router=useNavigate();  
    
const router = useNavigate(); // Place this near the top, before handleLogin

const handleLogin = async (username, password) => {
    try {
        let request = await client.post("/login", {
            username: username,
            password: password
        });

        if (request.status === httpStatus.OK) {
            localStorage.setItem("token", request.data.token);
            router("/home"); // <-- Redirect after successful login
        }
    } catch (error) {
        throw error;
    }
};

    const getHistoryOfUser=async()=>{
        try{
            let request=await client.get("/get_all_activity",{
                params:{
                    token:localStorage.getItem("token")
                }
            });
        }catch(err){
            throw err;
        }
    }

    const addToHistory=async(meetingCode)=>{
        try{
            let request=await client.post("/add_to_activity",{
                token:localStorage.getItem("token"),
                meeting_code:meetingCode
            });
            return request
        }catch(err){
            throw err;
        }
    }

    const data={
        userData,setUserData,getHistoryOfUser,addToHistory,handleRegister,handleLogin
    }
    return (
        <AuthContext.Provider value={data}>
        {children}
        </AuthContext.Provider>
    )
}