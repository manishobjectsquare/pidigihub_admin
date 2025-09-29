import React, { useState, createContext } from "react";
let loaderContext=createContext()
 
export default loaderContext

export let LoaderProvider=({ children })=>{
    const [loader,setLoader]=useState(false);
    return (
        <loaderContext.Provider value={{loader,setLoader}}>
               { children }
        </loaderContext.Provider>
    )
}