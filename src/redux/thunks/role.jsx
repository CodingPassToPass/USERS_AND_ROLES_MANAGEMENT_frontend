import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "../../utils/config";
import axios from "axios";



export const createRole = createAsyncThunk("/roles/add", async( formData, { rejectWithValue})=>{
    try{
        const { data} = await axios.post(`${server}/api/roles`, formData , { headers:{ "Content-Type":"application/json"} });
        return data;
    }
    catch(err){
        if(err.response){
            return rejectWithValue({message: err.response.data.message});
        }
        else{
            return rejectWithValue({message: err.message});
        }
    }
})


export const deleteRole  = createAsyncThunk("/roles/delete", async( userId, { rejectWithValue})=>{
    try{
        const { data} = await axios.delete(`${server}/api/roles/${userId}`,{ headers:{ "Content-Type":"application/json"} });
        return data;
    }
    catch(err){
        if(err.response){
            return rejectWithValue({message: err.response.data.message});
        }
        else{
            return rejectWithValue({message: err.message});
        }
    }
})
