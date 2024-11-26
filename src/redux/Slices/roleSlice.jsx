import { createSlice } from "@reduxjs/toolkit";
import { createRole, deleteRole } from "../thunks/role.jsx";

const roleSlice = createSlice({
    name:"role",
    initialState:{
        allRoles:[],
        isLoading: false,
        error:"",
        success: false,
        message:"",
    },
    reducers:{
        clearErrorAndSuccessForRoles:(state,action)=>{
            state.error = "";
            state.success = false;
            state.message = "";
        },
        AllRolesSet:(state,action)=>{
            state.allRoles = action.payload.roles;
        },
        setSuccess:( state,action)=>{
            state.success = action.payload;
        }
    },
    extraReducers: (builder)=>{

       
        //create new role
        builder.addCase( createRole.pending, ( state, action)=>{
            state.isLoading = true;
            state.success = false;
        }),
        builder.addCase( createRole.fulfilled, ( state, action)=>{
            
            //add user 
            state.success = action.payload.success;
            state.message = action.payload.message;
            state.isLoading = false;
            
        }),
        builder.addCase( createRole.rejected, ( state, action)=>{
            state.isLoading = false
            state.error = action.payload.message
        }),   

        //delete role
        builder.addCase( deleteRole.pending, ( state, action)=>{
            state.isLoading = true;
            state.success = false;
        }),
        builder.addCase( deleteRole.fulfilled, ( state, action)=>{
            
            state.success = action.payload.success; 
            state.isLoading = false;
        }),
        builder.addCase( deleteRole.rejected, ( state, action)=>{
            state.isLoading = false
            state.error = action.payload.message;
        })
    },
})

export const { clearErrorAndSuccessForRoles, AllRolesSet, setSuccess} = roleSlice.actions;

export default roleSlice.reducer;


