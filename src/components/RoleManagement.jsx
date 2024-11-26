import React, { useEffect, useState } from 'react';
import { Button, TextField, Box, IconButton, Typography, Select, InputLabel, MenuItem, Dialog, CircularProgress } from '@mui/material';
import { DataGrid} from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector} from "react-redux"; 
import { createRole, deleteRole } from '../redux/thunks/role.jsx';
import { toast} from "react-hot-toast";
import { server } from '../utils/config.jsx';
import axios from 'axios';
import { clearErrorAndSuccessForRoles, AllRolesSet } from '../redux/Slices/roleSlice';
import { setIsUpdateRoleDialog, setIsDeleteRoleDialog } from '../redux/Slices/component.jsx';
import UpdateRoleDialog from './Dialog/UpdateRoleDialog.jsx';
import DeleteRoleDialog from './Dialog/DeleteRoleDialog.jsx';
import AppLayout from './AppLayout/AppLayout.jsx';

const RoleManagement = () => {

    const dispatch = useDispatch();
    const { isLoading, error, success, message, allRoles} = useSelector(state=>state.role);

    //formdata
    const [ name, setName] = useState();
    const [ permissions, setPermissions] = useState(["READ"]);
    const [ currentDataForUpdate, setCurrentDataForUpdate] = useState();
    const [ loading, setLoading] = useState(false);


    //new user create-
    const handleCreateNewUser = ()=>{

        if(name.trim()===""){ return toast.error("Please Enter Name");} 

        const formData = new FormData();
        formData.append("name",name);
        formData.append("permissions",permissions);

        dispatch( createRole(formData));

        setName("");
        setPermissions(["READ"]);
    } 

    const handlePermissionSelect = (e)=>{
        
        if(e.target.value.length <1){
            e.target.value=["READ"];
        }
        setPermissions(e.target.value);
    }

    //fetch all roles
    useEffect(()=>{
        async function fetchRoles(){
            setLoading(true)
          try{
              const { data}= await axios.get(`${server}/api/roles`,{ headers:{ "Content-Type":"application/json"} });
              dispatch(AllRolesSet({roles: data.roles}));
              setLoading(false)
          }
          catch(err){
              console.log(err);
              setLoading(false)
          }
      }
      fetchRoles();

    },[success]);


   //errors and success 
    useEffect(()=>{

        if(error){
            toast.error(error);
            dispatch( clearErrorAndSuccessForRoles());
        }

        if(success){
            if(message){
                toast.success(message);
            }
            dispatch( clearErrorAndSuccessForRoles());
        }
      
    },[ error, success, message]);


    //columns for grid-table
    const columns = [
        { field: 'id', headerName: 'ID', width: 250},
        { field: 'name',headerName: 'Name',width: 170},
        { field: 'permissions',headerName: 'Permissions', width: 300, renderCell: (params)=>{
            return `${params.row.permissions.map((permission)=>{return permission}).join(", ")}`
        }},
        {headerName: 'Actions',description: 'you can edit or delete it',width: 170, renderCell: (params)=>{
            return (<div style={{display:"flex", justifyContent:"space-evenly",width:"120px"}}>
                <IconButton sx={{ padding:"0px" }} onClick={()=>{ dispatch(setIsUpdateRoleDialog(true)); setCurrentDataForUpdate(params.row)}}>
                    <EditIcon sx={{ padding:"6px", borderRadius:"50%","&:hover":{color:"blue"} }}/>
                </IconButton>
                <IconButton sx={{ padding:"0px"}} onClick={()=>{ dispatch(setIsDeleteRoleDialog(true)); setCurrentDataForUpdate(params.row)}}>
                    <DeleteIcon sx={{ padding:"6px", borderRadius:"50%","&:hover":{color:"red"} }}/>
                </IconButton>
            </div>
            )
        }},
        { field: '', headerName: '', flex:1}
      ];
      
      //rows for grid-table
      const rows = allRoles?.length>0 && allRoles.map((role,i)=>{
        return { id: role._id , name: role.name, permissions: role.permissions}
      });



    return (
        <AppLayout>
            {
                ( isLoading || loading )
                ?
                <Box sx={{width:"100vw",height:"100vh",backgroundColor:"#c5c4c4",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <CircularProgress color={"black"}/>
                </Box>
                :(<>
            {/* loading Dialog*/}
            <Dialog open={isLoading} ></Dialog>

            {/* update dialog */}
            <UpdateRoleDialog currentDataForUpdate={currentDataForUpdate}/>

            {/* delete dialog */}
            <DeleteRoleDialog currentDataForUpdate={currentDataForUpdate}/>

            {/* main  */}
            <Typography sx={{fontSize:"20px",color:"gray"}}>Create New User</Typography>
            <div style={{margin:"12px auto" , display:"flex", flexDirection:"column", alignItems:"start",borderRadius:"10px",boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>  
                <div style={{ display:"flex", alignItems:"center",padding:"12px",flexWrap:"wrap"}}>
                    
                    <TextField value={name} onChange={(e)=>{ setName(e.target.value)}} label="name" type="text" sx={{margin:'8px 20px',width:{xs:"290px",md:"380px"} }} />
                    
                    <Box sx={{width:"200px" ,display:"flex",height:"55px",alignItems:"center",width:"400px",marginLeft:{xs:"24px",md:"0px"}}}>
                        <InputLabel id="select-permission" sx={{marginRight:"12px"}}>Permissions</InputLabel>
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
                <Button onClick={handleCreateNewUser} sx={{  "&:hover":{backgroundColor:"gray"}, color:"white", backgroundColor:"black", padding:"10px 20px",letterSpacing:"1px",margin:"12px",marginLeft:"30px"}}>
                    Create Role
                </Button>
            </div>
            
            <Typography sx={{fontSize:"30px", textAlign:"center",marginTop:"40px"}}>All Roles</Typography>
            <Box sx={{ height: 400, width: '100%'}}>
                <Box sx={{ width:{ xs:"100%", md:"90%", lg:"80%"} ,margin:"20px auto"}}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 10,
                        },
                      },
                    }}
                   
                    sx={{
                        color:"black",
                        ".MuiDataGrid-columnHeader":{
                            backgroundColor:"black",
                            color:"white",
                            "&:hover":{
                                backgroundColor:"rgb(53, 52, 52)"
                            }
                        },
                        ".MuiDataGrid-columnHeader:focus":{
                            outline:"none",
                        },
                        ".MuiDataGrid-cell:focus":{
                            outline:"none",
                        }
                    }}

                disableColumnMenu={true}
                />
                </Box>
            </Box>
            </>)
        }
        </AppLayout>
    );
};

export default RoleManagement;