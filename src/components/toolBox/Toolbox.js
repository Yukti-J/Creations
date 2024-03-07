import React from "react";
import styles from "./Toolbox.module.css";
import { COLORS, MENU_ITEMS } from "@/constants";
import { useSelector, useDispatch } from "react-redux";
import { changeBrushSize, changeColor } from "@/slice/toolboxSlice";
import cx from 'classnames';

const Toolbox = () => {
  const activeMenuItem = useSelector((state) => state.menu.activeMenuItem);
  const dispatch = useDispatch();
  const showToolBox = activeMenuItem === MENU_ITEMS.PENCIL || activeMenuItem === MENU_ITEMS.RECTANGLE;
  const showBrush = activeMenuItem === MENU_ITEMS.PENCIL || activeMenuItem === MENU_ITEMS.ERASER || activeMenuItem === MENU_ITEMS.RECTANGLE;  
  const {color, size} = useSelector((state)=> state.toolbox[activeMenuItem]);


  const handleColor = (myColor) => {
    dispatch(changeColor({item:activeMenuItem, color:myColor}))
  };
  const handleBrushSize = (e) =>{
    dispatch(changeBrushSize({item:activeMenuItem, size: e.target.value}))
  }
  return (
    <div className={styles.toolBox}>
      {showToolBox && <div className={styles.section}>
        <h4 className={styles.boxTitle}>Stroke Color</h4>
        <div className={styles.colorSection}>
          <div
            className={cx(styles.colorBox, {[styles.active]: color === COLORS.BLACK})}
            style={{ backgroundColor: COLORS.BLACK }}
            onClick={()=>handleColor(COLORS.BLACK)}
          ></div>
          <div
            className={cx(styles.colorBox, {[styles.active]: color === COLORS.RED})}
            style={{ backgroundColor: COLORS.RED }}
            onClick={()=>handleColor(COLORS.RED)}
          ></div>
          <div
            className={cx(styles.colorBox, {[styles.active]: color === COLORS.BLUE})}
            style={{ backgroundColor: COLORS.BLUE }}
            onClick={()=>handleColor(COLORS.BLUE)}
          ></div>
          <div
            className={cx(styles.colorBox, {[styles.active]: color === COLORS.ORANGE})}
            style={{ backgroundColor: COLORS.ORANGE }}
            onClick={()=>handleColor(COLORS.ORANGE)}
          ></div>
          <div
            className={cx(styles.colorBox, {[styles.active]: color === COLORS.GREEN})}
            style={{ backgroundColor: COLORS.GREEN }}
            onClick={()=>handleColor(COLORS.GREEN)}
          ></div>
          <div
            className={cx(styles.colorBox, {[styles.active]: color === COLORS.YELLOW})}
            style={{ backgroundColor: COLORS.YELLOW }}
            onClick={()=>handleColor(COLORS.YELLOW)}
          ></div>
        </div>
      </div>}
      
      {showBrush &&
        <div className={styles.section}>
        <h4 className={styles.boxTitle}>Brush Size</h4>
        <input
          type="range"
          min={1}
          max={20}
          step={2}
          onChange={handleBrushSize}
          value={size}
        />
      </div>}
      
    </div>
  );
};

export default Toolbox;
