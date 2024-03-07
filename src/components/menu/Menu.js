import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faEraser,
  faRotateRight,
  faRotateLeft,
  faFileArrowDown,
  faShapes

} from "@fortawesome/free-solid-svg-icons";
import styles from './menu.module.css'
import { MENU_ITEMS } from "@/constants";
import { menuItemClick, actionItemClick } from "@/slice/menuSlice";
import cx from "classnames";

const Menu = () => {
  const dispatch = useDispatch();
  const activeMenuItem = useSelector((state) => state.menu.activeMenuItem);

  const handleMenuItemClick =(itemName)=>{
    dispatch(menuItemClick(itemName))
  }

  return (
    <div className={styles.menuContainer}>
      <div className={cx(styles.iconContainer, {[styles.active]: activeMenuItem === MENU_ITEMS.PENCIL})} onClick={()=>handleMenuItemClick(MENU_ITEMS.PENCIL)}>
        <FontAwesomeIcon icon={faPencil} className={styles.icon}/>
      </div>
      <div className={cx(styles.iconContainer, {[styles.active]: activeMenuItem === MENU_ITEMS.ERASER})} onClick={()=>handleMenuItemClick(MENU_ITEMS.ERASER)}>
        <FontAwesomeIcon icon={faEraser} className={styles.icon}/>
      </div>
{/*  */}
      <div className={cx(styles.iconContainer, {[styles.active]: activeMenuItem === MENU_ITEMS.RECTANGLE})} onClick={()=>handleMenuItemClick(MENU_ITEMS.RECTANGLE)}>
        <FontAwesomeIcon icon={faShapes} className={styles.icon}/>
      </div>
{/*  */}
      <div className={styles.iconContainer}>
        <FontAwesomeIcon icon={faRotateRight} className={styles.icon}/>
      </div>
      <div className={styles.iconContainer}>
        <FontAwesomeIcon icon={faRotateLeft} className={styles.icon}/>
      </div>
      <div className={styles.iconContainer}>
        <FontAwesomeIcon icon={faFileArrowDown} className={styles.icon}/>
      </div>
    </div>
  );
};

export default Menu;
