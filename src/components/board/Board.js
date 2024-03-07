import { MENU_ITEMS } from "@/constants";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const Board = () => {
  const canvasRef = useRef(null);
  const shouldDraw = useRef(false);
  const activeMenuItem = useSelector((state) => state.menu.activeMenuItem);
  const { color, size } = useSelector((state) => state.toolbox[activeMenuItem]);
  let startX, startY, xLine, yLine, x, y;

  // HOOK FOR SETTING COLOR AND SIZE
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const changeConfig = () => {
      context.strokeStyle = color;
      context.lineWidth = size;
    };

    changeConfig();
  }, [color, size]);
  // HOOK END

  // MOUNTING HOOK
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
        
  }, []);
  
  // DRAWING HOOK FOR PENCIL AND ERASER
  useEffect(()=>{
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const handleMouseDownPencil = (e) => {
      shouldDraw.current = true; 
      if (
        activeMenuItem === MENU_ITEMS.PENCIL ||
        activeMenuItem === MENU_ITEMS.ERASER
      ) {
        xLine = e.clientX;
        yLine = e.clientY;
        context.beginPath();
        context.moveTo(xLine, yLine);
      }
    };

    const handleMouseMovePencil = (e) => {
      if (!shouldDraw.current) return;
      if (
        activeMenuItem === MENU_ITEMS.PENCIL ||
        activeMenuItem === MENU_ITEMS.ERASER
      ) {
        x = e.clientX;
        y = e.clientY;
        context.lineTo(x,y);
        context.stroke();
      }
    };

    const handleMouseUpPencil = (e) => {
      shouldDraw.current = false;
    };

        canvas.addEventListener("mousedown", handleMouseDownPencil);
        canvas.addEventListener("mousemove", handleMouseMovePencil);
        canvas.addEventListener("mouseup", handleMouseUpPencil);
    
        canvas.addEventListener("touchstart", handleMouseDownPencil);
        canvas.addEventListener("touchmove", handleMouseMovePencil);
        canvas.addEventListener("touchend", handleMouseUpPencil);
    
        return () => {
          canvas.removeEventListener("mousedown", handleMouseDownPencil);
          canvas.removeEventListener("mousemove", handleMouseMovePencil);
          canvas.removeEventListener("mouseup", handleMouseUpPencil);
    
          canvas.removeEventListener("touchstart", handleMouseDownPencil);
          canvas.removeEventListener("touchmove", handleMouseMovePencil);
          canvas.removeEventListener("touchend", handleMouseUpPencil);
        };
  })
  

  // DRAWING HOOK FOR RECTANGLE
  useEffect(()=>{
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const handleMouseDownRect = (e) => {
      shouldDraw.current = true; 
      context.beginPath();
      if (activeMenuItem === MENU_ITEMS.RECTANGLE) {
        startX = e.pageX - canvas.offsetLeft;
        startY = e.pageY - canvas.offsetTop;
      }
      // context.moveTo(startX,startY);
    }

    const handleMouseMoveRect = (e) => {
      if (!shouldDraw.current) return;    
      
    };
    
    const handleMouseUpRect = (e) => {
      shouldDraw.current = false;
      if (activeMenuItem === MENU_ITEMS.RECTANGLE) {
        const mouseX = e.pageX - canvas.offsetLeft;
        const mouseY = e.pageY - canvas.offsetTop;
        
        const width = mouseX - startX;
        const height = mouseY - startY;

        const cenX = width;
        const cenY = height;
        const radius = width;
        context.strokeRect(startX, startY, width, height);
        // context.arc(cenX,cenY,radius,0,2*Math.PI);
        // context.stroke()
      }
    };

    canvas.addEventListener("mousedown", handleMouseDownRect);
        canvas.addEventListener("mousemove", handleMouseMoveRect);
        canvas.addEventListener("mouseup", handleMouseUpRect);
    
        canvas.addEventListener("touchstart", handleMouseDownRect);
        canvas.addEventListener("touchmove", handleMouseMoveRect);
        canvas.addEventListener("touchend", handleMouseUpRect);
    
        return () => {
          canvas.removeEventListener("mousedown", handleMouseDownRect);
          canvas.removeEventListener("mousemove", handleMouseMoveRect);
          canvas.removeEventListener("mouseup", handleMouseUpRect);
    
          canvas.removeEventListener("touchstart", handleMouseDownRect);
          canvas.removeEventListener("touchmove", handleMouseMoveRect);
          canvas.removeEventListener("touchend", handleMouseUpRect);
        };
    
  })
  
  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default Board;
