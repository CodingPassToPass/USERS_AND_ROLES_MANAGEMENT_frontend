import { Box, Dialog ,TextField, Select, MenuItem, Button, InputLabel, Typography, CircularProgress } from "@mui/material";
import { setIsUpdateRoleDialog } from "../../redux/Slices/component";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { toast} from "react-hot-toast";
import axios from "axios";
import { server } from "../../utils/config";
import { setSuccess } from "../../redux/Slices/roleSlice";


export default function UpdateRoleDialog( { currentDataForUpdate}){

    const dispatch = useDispatch();
    const { isUpdateRoleDialog} = useSelector(state=>state.component);

    //formdata
    const [ name, setName] = useState("");
    const [ permissions, setPermissions] = useState(["READ"]);


    //update user
    const handleUpdateRole = async ()=>{

        if(name.trim() ===""){ 
            return toast.error("name should not be empty"); 
        }

        const toastId = toast.loading("Loading...");
        dispatch(setSuccess(false));

        try{
            const { data} = await axios.put(`${server}/api/roles/${currentDataForUpdate?.id}`, { name, permissions}, { headers:{ "Content-Type":"application/json"} });
            if(data){
                toast.success(data.message,{id: toastId});
                dispatch(setSuccess(true));
            }
            
        }
        catch(err){
            console.log(err)
            if(err){
                toast.error("Something went wrong",{id:toastId});
                dispatch(setSuccess(false));
            }
        }

        dispatch(setIsUpdateRoleDialog(false))
    };

    //SET VALUE ON CHANGE
    useEffect(()=>{
        setName(currentDataForUpdate?.name);
        setPermissions(currentDataForUpdate?.permissions || ["READ"]);
    },[currentDataForUpdate]);



    const handlePermissionSelect = (e)=>{
        
        if(e.target.value.length <1){
            e.target.value=["READ"];
        }
        setPermissions(e.target.value);
    }

    return(
        <>
        <Dialog open={ isUpdateRoleDialog} onClose={()=>{dispatch(setIsUpdateRoleDialog(false))}} sx={{borderRadius:"80px",margin:"0px auto"}}>
            <Typography sx={{fontSize:"30px",textAlign:"center",marginTop:"20px"}}>Update User</Typography>
            <Box sx={{ width:{xs:"90vw",md:"50vw",lg:"30vw"},display:"flex",flexDirection:"column",alignItems:"center"}}>
              <div style={{ display:"flex", alignItems:"center",flexDirection:"column",width:"80%"}}>
                      
              <TextField value={name} onChange={(e)=>{ setName(e.target.value)}} label="name" type="text" style={{margin:'8px 20px',width:"90%"}} />
                    
                    <Box sx={{width:"200px" ,display:"flex",height:"55px",alignItems:"center",width:{sm:"95%",md:"90%"}}}>
                        <InputLabel id="select-permission" sx={{marginRight:"12px",}}>Permissions</InputLabel>
                        <Select
                          value={permissions}
                          onChange={handlePermissionSelect}
                          label="select-permission"
                          sx={{width:"200px"}}
                          multiple
                        >
                        <MenuItem value="READ" >READ</MenuItem>
                        <MenuItem value="CREATE">CREATE</MenuItem>
                        <MenuItem value="UPDATE">UPDATE</MenuItem>
                        <MenuItem value="DELETE">DELETE</MenuItem>
                        </Select>
                    </Box>
                  
                </div>
                <Button onClick={handleUpdateRole} sx={{  "&:hover":{backgroundColor:"gray"}, color:"white", backgroundColor:"black", padding:"10px 20px",letterSpacing:"1px",margin:"12px",marginLeft:"30px"}}>
                    Update Role
                </Button>
            </Box>
        </Dialog>
        </>
    )   
}