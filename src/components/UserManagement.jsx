import React, { useEffect, useState } from 'react';
import { Button, TextField, Box, IconButton, Typography, Select, InputLabel, MenuItem, Dialog, CircularProgress } from '@mui/material';
import { DataGrid} from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector} from "react-redux"; 
import { createUser, deleteUser } from '../redux/thunks/user.jsx';
import { toast} from "react-hot-toast";
import { server } from '../utils/config.jsx';
import axios from 'axios';
import { clearErrorAndSuccessForUsers, AllUsersSet } from '../redux/Slices/userSlice';
import { AllRolesSet } from '../redux/Slices/roleSlice';
import { setIsUpdateDialog, setIsDeleteDialog } from '../redux/Slices/component.jsx';
import UpdateDialog from './Dialog/UpdateDialog.jsx';
import DeleteDialog from './Dialog/DeleteDialog.jsx';
import AppLayout from './AppLayout/AppLayout.jsx';

const UserManagement = () => {


    const dispatch = useDispatch();
    const { isLoading, error, success, message, allUsers} = useSelector(state=>state.user);
    const { allRoles} = useSelector(state=>state.role);
    const [ loading, setLoading] = useState(false);

    //formdata
    const [ roles, setRoles] = useState([]);
    const [ username, setUsername] = useState("");
    const [ email, setEmail] = useState("");
    const [ age, setAge] = useState("");
    const [ status, setStatus] = useState(false);

   



    //new user create
    const handleCreateNewUser = ()=>{
     
       //validate
        if(username.trim() ===""){ return toast.error("username should not be empty"); };  if(email.trim() ===""){ return toast.error("email should not be empty");} if(age.trim() ===""){ return toast.error("age should not empty");}


        const formData = new FormData();
        formData.append("username",username);
        formData.append("email",email);
        formData.append("age",age);
        formData.append("isActive",status);


        let roleIds = "";
        if(roles?.length>0 && allRoles?.length>0){

            roleIds = allRoles.filter((role)=>{
                return roles.includes(role.name);
            }).map((fullRole)=>{
                return fullRole._id;
            })
        }
        formData.append("roles",roleIds);

        dispatch( createUser(formData));

        setUsername("");
        setEmail("");
        setAge("");
        setStatus("");
    } 

    //fetch all users
    useEffect(()=>{
        async function fetchUsers(){
            setLoading(true)
          try{
              const { data}= await axios.get(`${server}/api/users`,{ headers:{ "Content-Type":"application/json"} });
              console.log(data);
              dispatch(AllUsersSet({users: data.users}));
          }
          catch(err){
              setLoading(false);
          }
      }
      fetchUsers();

    },[success]);


    const [ selectOptionRoles, setSelectOptionRoles ] = useState([]);
    const [currentUserUpdateData, setCurrentUserUpdateData] = useState();

     //fetch all roles
     useEffect(()=>{
        async function fetchRoles(){
            setLoading(true)
          try{
              const { data}= await axios.get(`${server}/api/roles`,{ headers:{ "Content-Type":"application/json"} });
              dispatch(AllRolesSet({roles: data.roles}));
              setSelectOptionRoles(data.roles);
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
            dispatch( clearErrorAndSuccessForUsers());
        }

        if(success){
            if(message){
                toast.success(message);
            }
            dispatch( clearErrorAndSuccessForUsers());
        }
      
    },[ error, success, message]);


    //columns for grid-table
    const columns = [
        { field: 'id', headerName: 'ID', width: 230},
        { field: 'username',headerName: 'Name',width: 150},
        { field: 'email',headerName: 'Email',width: 280},
        { field: 'age',headerName: 'Age', headerAlign:"left", align:"left", type: 'number',width:180},
        { field: 'roles',headerName: 'Roles', width: 200, renderCell: (params)=>{
            return `${params.row.roles.map((role)=>{return role.name}).join(", ")}`
        }},
        {headerName: 'Actions',description: 'you can edit or delete it',width: 170, renderCell: (params)=>{
            return (<div style={{display:"flex", justifyContent:"space-evenly",width:"120px"}}>
                <IconButton sx={{ padding:"0px" }} onClick={()=>{ dispatch(setIsUpdateDialog(true)); setCurrentUserUpdateData(params.row)}}>
                    <EditIcon sx={{ padding:"6px", borderRadius:"50%","&:hover":{color:"blue"} }}/>
                </IconButton>
                <IconButton sx={{ padding:"0px"}} onClick={()=>{ dispatch(setIsDeleteDialog(true)); setCurrentUserUpdateData(params.row)}}>
                    <DeleteIcon sx={{ padding:"6px", borderRadius:"50%","&:hover":{color:"red"} }}/>
                </IconButton>
            </div>
            )
        }},
        { field: "status", headerName: "Status", width:100},
        { field: '', headerName: '', flex:1}
      ];
      
      //rows for grid-table
      const rows = allUsers?.length>0 && allUsers.map((user,i)=>{
        return { id: user._id , username: user.username, email: user.email, age: user.age, roles: user.roles,status: user.isActive ? "Active" : "Not Active"}
      });


      const handleRolesSelect = (e)=>{
        
        if(e.target.value.length <1){
            e.target.value=[];
        }
        setRoles(e.target.value);
    }

    //loading interval
    // const [ progress, setProgress] = useState(10);

    // useEffect(()=>{
    //     const timer = setInterval(()=>{
    //         setProgress((prevProgress)=>( prevProgress>=100 ? 0 : prevProgress+5))
    //     },500);

    //     return ()=>{
    //         clearInterval(timer);
    //     }
    // },[]);

    return (
        <AppLayout>
            {
                (isLoading || loading)
                ?
                <Box sx={{width:"100vw",height:"100vh",backgroundColor:"#c5c4c4",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <CircularProgress color={"black"}/>
                </Box>
                :(<>
            {/* loading Dialog*/}
            <Dialog open={isLoading}></Dialog>

            {/* update dialog */}
            <UpdateDialog currentUserUpdateData={currentUserUpdateData} selectOptionRoles={selectOptionRoles}/>

            {/* delete dialog */}
            <DeleteDialog currentUserUpdateData={currentUserUpdateData}/>

            {/* main  */}
            <Typography sx={{fontSize:"20px",color:"gray"}}>Create New User</Typography>
            <div style={{margin:"12px auto" , display:"flex", flexDirection:"column", alignItems:"start",borderRadius:"10px",boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>  
                <div style={{ display:"flex", alignItems:"center",padding:"12px",flexWrap:"wrap"}}>
                    
                    <TextField value={username} onChange={(e)=>{ setUsername(e.target.value)}} label="Username" type="text" style={{margin:'8px 20px'}} />
                    
                    <TextField value={email} onChange={(e)=>{ setEmail(e.target.value)}} label="Email" type='text' style={{margin:'8px 20px'}} />
                    
                    <TextField value={age} onChange={(e)=>{ setAge(e.target.value)}} label="Age" type="number" style={{margin:'8px 20px'}} />
                    
                    <Box sx={{width:"200px" ,display:"flex",height:"55px",alignItems:"center",marginLeft:{xs:"24px",md:"0px"}}}>
                        <InputLabel id="select-role" sx={{marginRight:"12px"}}>Roles</InputLabel>
                        <Select
                          value={roles}
                          onChange={handleRolesSelect}
                          label="select-role"
                          sx={{width:"100px"}}
                          multiple
                        >
                        {
                            selectOptionRoles?.length>0 && selectOptionRoles.map((selectRole)=>{
                                return <MenuItem value={selectRole.name} >{selectRole.name}</MenuItem>
                            })
                        }
                        
                        </Select>
                    </Box>

                    <Box sx={{width:"200px" ,display:"flex",height:"55px",alignItems:"center",marginLeft:{xs:"18px",md:"0px"},marginTop:{xs:"10px",md:"0px"}}}>
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
                <Button onClick={handleCreateNewUser} sx={{  "&:hover":{backgroundColor:"gray"}, color:"white", backgroundColor:"black", padding:"10px 20px",letterSpacing:"1px",margin:"12px",marginLeft:"30px"}}>
                    Create User
                </Button>
            </div>
            
            <Typography sx={{fontSize:"30px", textAlign:"center",marginTop:"40px"}}>All Users</Typography>
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

                disableColumnMenu={false}
                />
                </Box>
            </Box>
            </>)
        }
        </AppLayout>
    );
};

export default UserManagement;