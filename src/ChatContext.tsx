import { createContext, useEffect, useState } from "react";

interface ChatContextType {
  position: {x:number, y:number};
  onPointerDownFunc: (e: React.PointerEvent<HTMLButtonElement | HTMLDivElement>) => void;
}

export const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [position, setPosition] = useState({
      x: window.innerWidth - 80,
      y: window.innerHeight - 80,
  });

  const [dragging, setDragging] = useState(false);
  const [relativePosition, setRelativePosition] = useState<{x:number, y:number}>({
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
  

  return (
    <ChatContext.Provider
      value={{
        position,
        onPointerDownFunc,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}