import { Fab } from "@mui/material"
import { useContext } from "react";
import { ChatContext } from "./ChatContext";

export const ChatBotButton = () =>{
    const context = useContext(ChatContext)
    return(
        <Fab 
            onPointerDown={context?.onPointerDownFunc}
            style={{
                height:'50px',
                backgroundColor:'#6cad6c',
                width:'180px',
                padding:'10px',
                borderRadius:'15px',
                position: "fixed",
                left: context?.position?.x,
                top: context?.position?.y,
                fontWeight:'bolder'
            }}
        >
            {'PepeBot'}
        </Fab>
    )
}