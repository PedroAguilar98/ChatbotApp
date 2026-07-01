import { Fab } from "@mui/material"
import { useRef } from "react";

export const ChatBotButton = () =>{
    const fabRef = useRef<HTMLButtonElement | null>(null);

    const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
        const buttonPos = fabRef.current?.getBoundingClientRect();
        
        /* if(buttonPos){
            
            const rect = e.currentTarget.getBoundingClientRect();
            const dx = e.clientX - e.clientX + buttonPos.left;
            const dy = e.clientY - e.clientY + buttonPos.top;
    
            if (Math.sqrt(dx * dx + dy * dy) <= 5) {
                props.setIsButton(false)
            }
        } */
    };
    return(
        <Fab 
            color="primary"
            onClick={handlePointerMove}
            ref={fabRef}
            style={{
                width:'180px',
                padding:'10px',
                borderRadius:'15px'
            }}
        >
            {'PepeBot'}
        </Fab>
    )
}