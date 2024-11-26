import { createSlice } from "@reduxjs/toolkit";
import {  deleteUser, createUser } from "../thunks/user.jsx";


const userSlice = createSlice({
    name:"user",
    initialState:{
        allUsers:[],
        isLoading: false,
        error:"",
        success: false,
        message:""
    },
    reducers:{
        clearErrorAndSuccessForUsers:(state,action)=>{
            state.error = "";
            state.success = false;
            state.message = "";
        },
        AllUsersSet:(state,action)=>{
            state.allUsers = action.payload.users;
        },
        setUserSuccess:(state,action)=>{
            state.success = action.payload;
        }
    },
    extraReducers: (builder)=>{

        //create new user
        builder.addCase( createUser.pending, ( state, action)=>{
            state.isLoading = true;
            state.success = false;
        }),
        builder.addCase( createUser.fulfilled, ( state, action)=>{
            
            //add user 
            state.success = action.payload.success;
            state.isLoading = false;
            state.message = action.payload.message;
            
        }),
        builder.addCase( createUser.rejected, ( state, action)=>{
            state.isLoading = false
            state.error = action.payload.message
        }),   

        //delete user 
        builder.addCase( deleteUser.pending, ( state, action)=>{
            state.isLoading = true;
            state.success = false;
        }),
        builder.addCase( deleteUser.fulfilled, ( state, action)=>{
            
            state.success = action.payload.success; 
            state.isLoading = false;
            state.message = action.payload.message;
        }),
        builder.addCase( deleteUser.rejected, ( state, action)=>{
            state.isLoading = false
            state.error = action.payload.message;
        })
    },
})

export const { clearErrorAndSuccessForUsers, AllUsersSet, setUserSuccess} = userSlice.actions;

export default userSlice.reducer;