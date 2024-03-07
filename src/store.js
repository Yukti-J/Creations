import { configureStore } from "@reduxjs/toolkit";
import menuSlice from "./slice/menuSlice";
import  toolboxSlice  from "./slice/toolboxSlice";

export const store = configureStore({
    reducer: {
        menu: menuSlice,
        toolbox: toolboxSlice
    }
})