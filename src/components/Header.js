import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import {useHistory} from "react-router-dom";


const Header = ({children,hasHiddenAuthButtons}) =>
    {
    const history=useHistory();
    const logout=()=>{
      localStorage.removeItem('username');
      localStorage.removeItem('token');
      localStorage.removeItem('balance');
      history.push("/");
      window.location.reload()
    }
    const backEvent=()=>{
      history.push("/")
    }
    const handleInput=(e)=>{
      const url="/"+e.target.name;
      history.push(url);
    }
    if(hasHiddenAuthButtons){
        return (
            <Box className="header">
              <Box
                className="header-title"
              >
                <img src="logo_light.svg" alt="QKart-icon"></img>
              </Box>
              {children}
                <Button
                  className="explore-button"
                  startIcon={<ArrowBackIcon />}
                  variant="text"
                  onClick={backEvent}
                >
                  Back to explore
                </Button>
            </Box>
          );
    }

    return(
        <Box className="header">
              <Box
                className="header-title"
              >
                <img src="logo_light.svg" alt="QKart-icon"></img>
              </Box>
              {children}
            <Stack direction="row" spacing={1} alignItems="center">
                {localStorage.getItem("username")?(
                    <>
                        <Avatar 
                            src="avatar.png"
                            alt={localStorage.getItem("username") ||"profile"}
                        />
                        <p className="username-text">{localStorage.getItem("username")}</p>
                        <Button type="primary" onClick={(e)=>logout(e)}>Logout</Button>
                    </>
                ):(
                    <>
                        <Button name="login" onClick={handleInput}>Login</Button>
                        <Button name="register" onClick={handleInput} variant="contained">Register</Button>
                    </>
                )}
            </Stack>
        </Box>
    )
    
  };

export default Header;


