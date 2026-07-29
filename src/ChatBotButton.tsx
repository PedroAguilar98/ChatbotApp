import { Fab } from "@mui/material"
import { useContext } from "react";
import { ChatContext } from "./ChatContext";
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';

export const ChatBotButton = (props:{color:string, chatName:string, titleColor:string, iconSrc:string | null}) =>{
    const context = useContext(ChatContext)
    return(
        <Fab 
            onPointerDown={context?.onPointerDownFunc}
            style={{
                height:'50px',
                color:props.titleColor,
                backgroundColor:props.color,
                width:'180px',
                padding:'10px',
                borderRadius:'15px',
                position: "fixed",
                left: context?.position?.x,
                top: context?.position?.y,
                fontWeight:'bolder'
            }}
        >
            {
                props.iconSrc ?
                <img src={props.iconSrc} alt="" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} /> :
                <SmartToyOutlinedIcon />
            }
            {props.chatName}
        </Fab>
    )
}