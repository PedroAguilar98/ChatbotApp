import { Fab } from "@mui/material"
import { useContext, useRef } from "react";
import { ChatContext } from "./ChatContext";

export const ChatBotButton = () =>{
    const fabRef = useRef<HTMLButtonElement | null>(null);
    const context = useContext(ChatContext)
    
    return(
        <Fab 
            color="primary"
            onPointerDown={context?.onPointerDownFunc}
            ref={fabRef}
            style={{
                width:'180px',
                padding:'10px',
                borderRadius:'15px',
                position: "fixed",
                left: context?.position.x,
                top: context?.position.y,
            }}
        >
            {'PepeBot'}
        </Fab>
    )
}