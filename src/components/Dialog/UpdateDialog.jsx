import { Box, Dialog ,TextField, Select, MenuItem, Button, InputLabel, Typography } from "@mui/material";
import { setIsUpdateDialog } from "../../redux/Slices/component";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { toast} from "react-hot-toast";
import axios from "axios";
import { server } from "../../utils/config";
import { setUserSuccess } from "../../redux/Slices/userSlice";

export default function UpdateDialog( { currentUserUpdateData, selectOptionRoles}){

    const dispatch = useDispatch();
    const { isUpdateDialog} = useSelector(state=>state.component);
    const { allRoles} = useSelector(state=>state.role);

    //formdata
    const [ roles, setRoles] = useState([]);
    const [ username, setUsername] = useState("");
    const [ email, setEmail] = useState("");
    const [ age, setAge] = useState(0);
    const [ status, setStatus] = useState(false);

    //update user
    const handleUpdateUser = async ()=>{

        //validate
        if(username.trim() ===""){ return toast.error("username should not be empty"); };  if(email.trim() ===""){ return toast.error("email should not be empty");} if(age ===0){ return toast.error("age should not zero");}


        const formData = new FormData();
        formData.append("username",username);
        formData.append("email",email);
        formData.append("age",age);
        formData.append("isActive",status);

        //find ids for each role
        let roleIds = "";
        if(roles?.length>0 && allRoles?.length>0){

            roleIds = allRoles.filter((role)=>{
                return roles.includes(role.name);
            }).map((fullRole)=>{
                return fullRole._id;
            })
        }

        formData.append("roles",roleIds);


        //api

        dispatch(setUserSuccess(false));
        try{
            const { data} = await axios.put(`${server}/api/users/${currentUserUpdateData?.id}`, formData, { headers:{ "Content-Type":"application/json"} });
            dispatch(setUserSuccess(true));
            if(data){
                toast.success("User Updated Successfully");
            }
        }
        catch(err){
            console.log(err)
            if(err){
                toast.error("Something went wrong");
            }
        }

        dispatch( setIsUpdateDialog(false));

    };


    //select roles
    const handleRolesSelect = (e)=>{
        
        if(e.target.value.length <1){
            e.target.value=["viewer"];
        }
        setRoles(e.target.value);
    }

    useEffect(()=>{

        setUsername(currentUserUpdateData?.username);
        setRoles( (currentUserUpdateData?.roles.length>0 && currentUserUpdateData?.roles.map((role)=>{ return role.name}) ) || []);
        setEmail(currentUserUpdateData?.email);
        setAge(currentUserUpdateData?.age);
        setStatus(currentUserUpdateData?.status==="Active"?true:false);

    },[ currentUserUpdateData, selectOptionRoles])


    return(
        <>
        <Dialog open={ isUpdateDialog} onClose={()=>{dispatch(setIsUpdateDialog(false))}} sx={{boxSizing:"border-box",borderRadius:"80px"}}>
            <Typography sx={{fontSize:"30px",textAlign:"center",marginTop:"20px"}}>Update User</Typography>
            <Box sx={{ width:"40vw",display:"flex",flexDirection:"column",alignItems:"center",boxSizing:"border-box"}}>
              <div style={{ display:"flex", alignItems:"center",padding:"12px",flexWrap:"wrap",width:"80%",boxSizing:"border-box"}}>
                      
                      <TextField value={username} onChange={(e)=>{ setUsername(e.target.value)}} label="Username" type="text" style={{margin:'8px 20px',width:"80%"}} />
                      
                      <TextField value={email} onChange={(e)=>{ setEmail(e.target.value)}} label="Email" type='text' style={{margin:'8px 20px',width:"80%"}} />
                      
                      <TextField value={age} onChange={(e)=>{ setAge(e.target.value)}} label="Age" type="Age" style={{margin:'8px 20px',width:"80%"}} />
                      
                      <Box sx={{display:"flex",height:"55px",alignItems:"center",width:"80%",marginLeft:"20px",marginTop:"10px"}}>
                          <InputLabel id="select-role" sx={{marginRight:"12px"}}>Roles</InputLabel>
                          <Select
                            value={roles}
                            onChange={handleRolesSelect}
                            label="select-role"
                            sx={{minWidth:"100px"}}
                            multiple
                          >
                          {
                            selectOptionRoles?.length>0 && selectOptionRoles.map((selectRole)=>{
                                return <MenuItem value={selectRole.name} >{selectRole.name}</MenuItem>
                            })
                           }
                          </Select>
                      </Box>
  
                      <Box sx={{width:"200px" ,display:"flex",height:"55px",alignItems:"center",width:"80%",marginLeft:"20px",marginTop:"10px"}}>
                          <InputLabel id="select-status" sx={{marginRight:"12px"}}>Status</InputLabel>
                          <Select
                            value={status}
                            onChange={(e)=>{setStatus(e.target.value)}}
                            label="select-status"
                            sx={{width:"100px"}}
                          >
                          <MenuItem value="true" >True</MenuItem>
                          <MenuItem value="false" >False</MenuItem>
                          </Select>
                      </Box>
                  
                </div>
                <Button onClick={handleUpdateUser} sx={{  "&:hover":{backgroundColor:"gray"}, color:"white", backgroundColor:"black", padding:"10px 20px",letterSpacing:"1px",margin:"12px",marginLeft:"30px"}}>
                    Update
                </Button>
            </Box>
        </Dialog>
        </>
    )   
}