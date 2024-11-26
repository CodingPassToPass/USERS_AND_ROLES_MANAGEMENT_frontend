import { Dialog, Box, DialogTitle, DialogContent, Button } from "@mui/material";
import { setIsDeleteRoleDialog } from "../../redux/Slices/component";
import { useDispatch, useSelector } from "react-redux";
import { deleteRole } from "../../redux/thunks/role";
import { toast} from "react-hot-toast";

export default function DeleteDialog( { currentDataForUpdate}){

    const dispatch = useDispatch();
    const { isDeleteRoleDialog} = useSelector(state=>state.component);


    const handleDeleteRole = ()=>{

        if(currentDataForUpdate?.name==="viewer"){
            return toast.error("You cannot Delete viewer");
        }

        dispatch(deleteRole(currentDataForUpdate.id));
        toast.success("Role Deleted Successfully");
        dispatch(setIsDeleteRoleDialog(false));
    }

    return(
        <>
        <Dialog open={isDeleteRoleDialog} onClose={()=>{ dispatch(setIsDeleteRoleDialog(false))}}>
            <Box sx={{borderRadius:"20px"}}>
                <DialogTitle>Delete Alert</DialogTitle>
                <DialogContent sx={{fontSize:"18px"}}>Are you sure you want to detete this role</DialogContent>
                <Box sx={{width:"80%",margin:"0px auto",display:"flex",justifyContent:"space-around" }}>
                    <Button sx={{color:"red"}} onClick={()=>{dispatch(setIsDeleteRoleDialog(false))}}>No</Button>
                    <Button sx={{color:"green"}} onClick={handleDeleteRole}>Yes</Button>
                </Box>
            </Box>
        </Dialog>
        </>
    )   
}