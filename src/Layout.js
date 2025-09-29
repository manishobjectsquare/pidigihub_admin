import React, { useContext, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Component/layout/Header";
import Sidebar from "./Component/layout/Sidebar";
import loaderContext from "./context/LoaderContext";
export default function Layout() {
  let { loader, setLoader } = useContext(loaderContext);
     const useAutoLogout = (logoutCallback, timeout = 30 * 60 * 1000) => {
        const timer = useRef(null);
        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
        const resetTimer = () => {
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(() => {
                logoutCallback();
            }, timeout);
        };
        useEffect(() => {

            events.forEach(event => window.addEventListener(event, resetTimer));
            resetTimer();
            return () => {
                events.forEach(event => window.removeEventListener(event, resetTimer));
                if (timer.current) clearTimeout(timer.current);
            };
        }, []);
    };
  return (
    <>
      <Header useAutoLogout={useAutoLogout} />
      <Sidebar />
      <Outlet />
      {loader ? (
        <div className={`${loader ? "loader-main" : ""}`}>
          <div className={`${loader ? "loader" : ""}`}></div>
        </div>
      ) : null}
    </>
  );
}
