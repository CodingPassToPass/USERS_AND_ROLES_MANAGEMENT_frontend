import { Button, Typography, Drawer, Box, IconButton } from "@mui/material";
import { Close, Menu} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setIsMobileOpen } from "../../redux/Slices/component";

 
export default function AppLayout({children}){

    const location = useLocation();
    
    const dispatch = useDispatch();
    const {  isMobileOpen} = useSelector(state=>state.component);

    return(
        <>
        {children}
         {/* icon to open sidebar(drawer)*/}
         <Box 
         sx={{
             position:"fixed", 
             right:"25px", 
             top:"20px",
         }}
        >
         <IconButton onClick={()=>{ dispatch(setIsMobileOpen(!isMobileOpen))}}>
             { isMobileOpen ? <Close sx={{fontSize:"40px"}}/> :  <Menu sx={{fontSize:"40px"}} />}
         </IconButton>
        </Box>
        
        {/* Drawer for mobiles */}
        <Drawer open={isMobileOpen} onClose={()=>{dispatch(setIsMobileOpen(!isMobileOpen))}}>
         <Box sx={{ width:{xs:"60vw",md:"50vw",lg:"40vw"}}}>
        
               <Link to="/roles" style={{width:"100%", display:"block",backgroundColor: location.pathname==="/roles"? "black": "white", color: location.pathname==="/roles"? "white":"black",textDecoration:"none", padding:"25px 0px",borderBottom:"2px solid white",borderRadius:"10px"}}>
                   <Typography sx={{marginLeft:"18px"}}>Roles Management</Typography>
               </Link>
         
               <Link to="/users" style={{width:"100%", display:"block",backgroundColor: location.pathname==="/users"? "black": "white", color: location.pathname==="/users"? "white": "black", textDecoration:"none",padding:"25px 0px",borderRadius:"10px"}}>
                   <Typography sx={{marginLeft:"18px"}}>Users Management</Typography>
               </Link>
           
        </Box>
        </Drawer>
        </>
    )
}
       