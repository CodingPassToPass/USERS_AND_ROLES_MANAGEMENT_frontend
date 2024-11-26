import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "../../utils/config.jsx";
import axios from "axios";


export const createUser = createAsyncThunk("/users/add", async( formData, { rejectWithValue})=>{
    
    try{
        const { data} = await axios.post(`${server}/api/users`, formData , { headers:{ "Content-Type":"application/json"} });
        console.log(data);
        return data;
    }
    catch(err){
        console.log(err);
        if(err.response){
            return rejectWithValue({message: err.response.data.message});
        }
        else{
            return rejectWithValue({message: err.message});
        }
    }
})

export const deleteUser  = createAsyncThunk("/users/delete", async( userId, { rejectWithValue})=>{
    try{
        const { data} = await axios.delete(`${server}/api/users/${userId}`,{ headers:{ "Content-Type":"application/json"} });
        return data;
    }
    catch(err){
        console.log(err);
        if(err.response){
            return rejectWithValue({message: err.response.data.message});
        }
        else{
            return rejectWithValue({message: err.message});
        }
    }
})
