import { createContext, useEffect, useState } from "react";

interface Position {
  x:number, 
  y:number
}

interface ChatContextType {
  position: {x:number, y:number} | null;
  onPointerDownFunc: (e: React.PointerEvent<HTMLButtonElement | HTMLDivElement>) => void;
  isButton:boolean;
  setIsButton:React.Dispatch<React.SetStateAction<boolean>>;
  setPosition:React.Dispatch<React.SetStateAction<Position>>
}

export const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isButton, setIsButton] = useState(true)
  const buttonSize = {width:180, height:50}
  const chatSize = {width:300, height:500}
  const [position, setPosition] = useState<Position>({
      x: window.innerWidth - 200 - chatSize.width + buttonSize.width,
      y: window.innerHeight - chatSize.height - buttonSize.height,
    });
  const [originalPosition, setOriginalPosition] = useState<Position | null>(null)
  const [dragging, setDragging] = useState(false);
  const [relativePosition, setRelativePosition] = useState<Position>({
      x: 0,
      y: 0,
  })

  const onPointerDownFunc = (e:React.PointerEvent<HTMLButtonElement | HTMLDivElement>) =>{
    const rect = e.currentTarget.getBoundingClientRect();
    const absolutePosX = e.clientX
    const absolutePosY = e.clientY
    setRelativePosition({
        x:absolutePosX - rect.left,
        y:absolutePosY - rect.top
    })
  }

  useEffect(()=>{

  },[position])

  useEffect(() => {
      let moveCount = 0
      const handleMove = (e: PointerEvent) => {
          if (!dragging) return;
          moveCount ++
          setPosition({
              x:e.clientX - relativePosition.x,
              y:e.clientY - relativePosition.y 
          })
      }

      const handleUp = () => {
          if(
            isButton &&
            !moveCount
          ){
            setIsButton(false)
          }
          setOriginalPosition(position)
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

  useEffect(()=>{
    const viewportCenterY = window.innerHeight / 2;

    const viewportCenterX = window.innerWidth / 2;
    let auxPosition = {...position}
    if(isButton){
      if(viewportCenterY <= position.y + chatSize.height - buttonSize.height){
        auxPosition.y = auxPosition.y + chatSize.height - buttonSize.height
      } 
      if(viewportCenterX <= position.x){
        auxPosition.x = auxPosition.x + chatSize.width - buttonSize.width
      } 
    } else {
      if(viewportCenterY <= position.y){
        auxPosition.y = auxPosition.y - chatSize.height + buttonSize.height
      } 
      if(viewportCenterX <= position.x){
        auxPosition.x = auxPosition.x - chatSize.width + buttonSize.width
      } 
    }
    setPosition(auxPosition)
    if(!originalPosition){
      setOriginalPosition(auxPosition)
    }
  },[isButton])
  

  return (
    <ChatContext.Provider
      value={{
        position,
        onPointerDownFunc,
        isButton,
        setIsButton,
        setPosition,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}