import { createSlice } from "@reduxjs/toolkit";

const componentSlice = createSlice({
    name:"component",
    initialState:{
        isUpdateDialog: false,
        isDeleteDialog: false,
        isUpdateRoleDialog:false,
        isDeleteRoleDialog:false,
        isMobileOpen: false,
    },
    reducers:{
        setIsUpdateDialog:(state,action)=>{
            state.isUpdateDialog = action.payload;
        },
        setIsDeleteDialog:(state,action)=>{
            state.isDeleteDialog = action.payload;
        },
        setIsUpdateRoleDialog:(state,action)=>{
            state.isUpdateRoleDialog = action.payload;
        },
        setIsDeleteRoleDialog:(state,action)=>{
            state.isDeleteRoleDialog = action.payload;
        },
        setIsMobileOpen: ( state,action)=>{
            state.isMobileOpen = action.payload;
        }
    },
})

export const { setIsUpdateDialog, setIsDeleteDialog, setIsDeleteRoleDialog, setIsUpdateRoleDialog, setIsMobileOpen} = componentSlice.actions;

export default componentSlice.reducer;