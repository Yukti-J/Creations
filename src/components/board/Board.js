import { MENU_ITEMS } from "@/constants";
import React, { useEffect, useRef, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionItemClick } from "@/slice/menuSlice";

const Board = () => {
  const canvasRef = useRef(null);
  const shouldDraw = useRef(false);
  const {activeMenuItem, actionMenuItem} = useSelector((state) => state.menu)
  const drawHistory = useRef([]);
  const historyPointer = useRef(0);
  const { color, size } = useSelector((state) => state.toolbox[activeMenuItem]);
  const dispatch = useDispatch();
  let startX, startY;

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

  // DOWNLOAD, UNDO, REDO HOOK
  useEffect(()=>{
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    
    if(actionMenuItem === MENU_ITEMS.DOWNLOAD){
      const URL = canvas.toDataURL()
      const anchor = document.createElement('a');
      anchor.href = URL
      anchor.download = 'sketch.jpg'
      anchor.click();
    }else if(actionMenuItem === MENU_ITEMS.REDO || actionMenuItem === MENU_ITEMS.UNDO){
      if(historyPointer.current > 1 && actionMenuItem === MENU_ITEMS.UNDO) historyPointer.current -= 1;
      else if(historyPointer.current < drawHistory.current.length - 1 && actionMenuItem === MENU_ITEMS.REDO) historyPointer.current += 1;
      const imageData = drawHistory.current[historyPointer.current];
      context.putImageData(imageData, 0, 0);
    }else if(actionMenuItem === MENU_ITEMS.DELETE){
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
    dispatch(actionItemClick(null));
  },[actionMenuItem,dispatch])
  // HOOK END

  // MOUNTING HOOK
  useLayoutEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    context.fillStyle = 'white'
    context.fillRect(0,0,canvas.width, canvas.height)
        
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    drawHistory.current.push(imageData)
    historyPointer.current = drawHistory.current.length - 1
  }, []);
  // HOOK END
  
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
        context.beginPath();
        context.moveTo(e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY);
      }
    };

    const handleMouseMovePencil = (e) => {
      if (!shouldDraw.current) return;
      if (
        activeMenuItem === MENU_ITEMS.PENCIL ||
        activeMenuItem === MENU_ITEMS.ERASER
      ) {
        context.lineTo(e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY);
        context.stroke();
      }
    };

    const handleMouseUpPencil = (e) => {
      shouldDraw.current = false;
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
            drawHistory.current.push(imageData)
            historyPointer.current = drawHistory.current.length - 1
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
        startX = e.clientX || e.touches[0].clientX - canvas.offsetLeft;
        startY = e.clientY || e.touches[0].clientY - canvas.offsetTop;
      }
      // context.moveTo(startX,startY);
    }

    const handleMouseMoveRect = (e) => {
      if (!shouldDraw.current) return;    
      
    };
    
    const handleMouseUpRect = (e) => {
      shouldDraw.current = false;
      if (activeMenuItem === MENU_ITEMS.RECTANGLE) {
        const mouseX = e.clientX || e.touches[0].clientX - canvas.offsetLeft;
        const mouseY = e.clientY || e.touches[0].clientY - canvas.offsetTop;
        
        const width = mouseX - startX;
        const height = mouseY - startY;

        const cenX = width;
        const cenY = height;
        const radius = width;
        context.strokeRect(startX, startY, width, height);
        // context.arc(cenX,cenY,radius,0,2*Math.PI);
        // context.stroke()

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        drawHistory.current.push(imageData)
        historyPointer.current = drawHistory.current.length - 1
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
  

  // DRAWING HOOK FOR CIRCLE
  useEffect(()=>{
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const handleMouseDownCircle = (e) => {
      shouldDraw.current = true; 
      context.beginPath();
      if (activeMenuItem === MENU_ITEMS.CIRCLE) {
        startX = e.clientX || e.touches[0].clientX - canvas.offsetLeft;
        startY = e.clientY || e.touches[0].clientY - canvas.offsetTop;
      }
      // context.moveTo(startX,startY);
    }

    const handleMouseMoveCircle = (e) => {
      if (!shouldDraw.current) return;    
    };
    
    const handleMouseUpCircle = (e) => {
      shouldDraw.current = false;
      if (activeMenuItem === MENU_ITEMS.CIRCLE) {
        const mouseX = e.clientX || e.touches[0].clientX ;
        const mouseY = e.clientY || e.touches[0].clientY;
        
        const width = mouseX - startX;
        const height = mouseY - startY;

        const cenX = startX + width/2;
        const cenY = startY + height/2;
        let radius = width/2;
        if(radius<0) radius = radius*-1;
        context.arc(cenX,cenY,radius,0,2*Math.PI);
        context.stroke()

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        drawHistory.current.push(imageData)
        historyPointer.current = drawHistory.current.length - 1
      }
    };

    canvas.addEventListener("mousedown", handleMouseDownCircle);
        canvas.addEventListener("mousemove", handleMouseMoveCircle);
        canvas.addEventListener("mouseup", handleMouseUpCircle);
    
        canvas.addEventListener("touchstart", handleMouseDownCircle);
        canvas.addEventListener("touchmove", handleMouseMoveCircle);
        canvas.addEventListener("touchend", handleMouseUpCircle);
    
        return () => {
          canvas.removeEventListener("mousedown", handleMouseDownCircle);
          canvas.removeEventListener("mousemove", handleMouseMoveCircle);
          canvas.removeEventListener("mouseup", handleMouseUpCircle);
    
          canvas.removeEventListener("touchstart", handleMouseDownCircle);
          canvas.removeEventListener("touchmove", handleMouseMoveCircle);
          canvas.removeEventListener("touchend", handleMouseUpCircle);
        };
    
  })

  // DRAWING HOOK FOR LINE
  useEffect(()=>{
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const handleMouseDownLine = (e) => {
      shouldDraw.current = true; 
      context.beginPath();
      if (activeMenuItem === MENU_ITEMS.LINE) {
        context.moveTo(e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY);
      }
    }

    const handleMouseMoveLine = (e) => {
      if (!shouldDraw.current) return;    
    };
    
    const handleMouseUpLine = (e) => {
      shouldDraw.current = false;
      if (activeMenuItem === MENU_ITEMS.LINE) {
        context.lineTo(e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY)
        context.stroke();

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        drawHistory.current.push(imageData)
        historyPointer.current = drawHistory.current.length - 1
      }
    };

    canvas.addEventListener("mousedown", handleMouseDownLine);
        canvas.addEventListener("mousemove", handleMouseMoveLine);
        canvas.addEventListener("mouseup", handleMouseUpLine);
    
        canvas.addEventListener("touchstart", handleMouseDownLine);
        canvas.addEventListener("touchmove", handleMouseMoveLine);
        canvas.addEventListener("touchend", handleMouseUpLine);
    
        return () => {
          canvas.removeEventListener("mousedown", handleMouseDownLine);
          canvas.removeEventListener("mousemove", handleMouseMoveLine);
          canvas.removeEventListener("mouseup", handleMouseUpLine);
    
          canvas.removeEventListener("touchstart", handleMouseDownLine);
          canvas.removeEventListener("touchmove", handleMouseMoveLine);
          canvas.removeEventListener("touchend", handleMouseUpLine);
        };
    
  })
  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default Board;
