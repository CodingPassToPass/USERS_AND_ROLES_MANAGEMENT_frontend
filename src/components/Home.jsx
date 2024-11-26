import { Button, Typography, Drawer, Box, IconButton } from "@mui/material";
import { setIsMobileOpen } from "../redux/Slices/component";
import AppLayout from "./AppLayout/AppLayout";
import { useDispatch } from "react-redux";

export default function Home(){

    const dispatch = useDispatch();

    return (
        <AppLayout>
        <Typography sx={{fontSize:"30px"}}>Welcome to the Home page</Typography>
        <Button sx={{backgroundColor:"black",color:"white",padding:"12px 32px ",margin:"30px","&:hover":{backgroundColor:"gray"}}} onClick={()=>{dispatch(setIsMobileOpen(true))}}><Typography sx={{fontSize:"30px"}}>Click Me to Manage Roles and Users</Typography></Button>
        </AppLayout>
    )
}