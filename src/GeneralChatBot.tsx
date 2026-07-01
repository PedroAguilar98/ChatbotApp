import { useEffect, useState } from "react"
import { ChatBotButton } from "./ChatBotButton"
import { ChatBotChat } from "./ChatBotChat"

export const GeneralChatBot = () =>{
    const [isButton, setIsButton] = useState(true)
    const [position, setPosition] = useState({
        x: window.innerWidth - 80,
        y: window.innerHeight - 80,
    });

   const [dragging, setDragging] = useState(false);
   const [relativePosition, setRelativePosition] = useState<{x:number, y:number}>({
        x: 0,
        y: 0,
    })

    useEffect(() => {
        const handleMove = (e: PointerEvent) => {
            if (!dragging) return;

            
            setPosition({
                x:e.clientX - relativePosition.x,
                y:  e.clientY - relativePosition.y
            });
        };

        const handleUp = () => {
            setDragging(false);
        };

        window.addEventListener("pointermove", handleMove);
        window.addEventListener("pointerup", handleUp);

        return () => {
            window.removeEventListener("pointermove", handleMove);
            window.removeEventListener("pointerup", handleUp);
        };
    }, [dragging]);

    useEffect(()=>{
        if(relativePosition.x || relativePosition.y){
            setDragging(true)
        }
    },[relativePosition])

    return(
        <div
            onPointerDown={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const absolutePosX = e.clientX
                const absolutePosY = e.clientY
                setRelativePosition({
                    x:absolutePosX - rect.left,
                    y:absolutePosY - rect.top
                })
            }}

            onClick={()=>setIsButton(false)}

            style={{
                position: "fixed",
                left: position.x,
                top: position.y,
            }}

        >
        {
            isButton ?
                <ChatBotButton/>
            :
                <ChatBotChat/>
        }
        </div>
    )
    
}