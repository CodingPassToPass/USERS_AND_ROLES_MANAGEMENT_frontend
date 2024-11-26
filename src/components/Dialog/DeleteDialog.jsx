import { Dialog, Box, DialogContent, DialogTitle, Button } from "@mui/material";
import { setIsDeleteDialog } from "../../redux/Slices/component";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser } from "../../redux/thunks/user";
import { useEffect } from "react";
import  { toast} from "react-hot-toast";

export default function DeleteDialog( { currentUserUpdateData}){

    const dispatch = useDispatch();
    const { isDeleteDialog} = useSelector(state=>state.component);

    //handle delete role
    const handleDeleteUser = ()=>{

        dispatch(deleteUser(currentUserUpdateData?.id));
        dispatch(setIsDeleteDialog(false));
    }

    useEffect(()=>{
     //render when cuurent data is changed
    },[currentUserUpdateData]);

    

    return(
        <>
        <Dialog open={isDeleteDialog} onClose={()=>{ dispatch(setIsDeleteDialog(false))}}>
            <Box sx={{borderRadius:"20px"}}>
                <DialogTitle>Delete Alert</DialogTitle>
                <DialogContent sx={{fontSize:"18px"}}>Are you sure you want to detete this role</DialogContent>
                <Box sx={{width:"80%",margin:"0px auto",display:"flex",justifyContent:"space-around" }}>
                    <Button sx={{color:"red"}} onClick={()=>{dispatch(setIsDeleteDialog(false))}}>No</Button>
                    <Button sx={{color:"green"}} onClick={handleDeleteUser}>Yes</Button>
                </Box>
            </Box>
        </Dialog>
        </>
    )   
}