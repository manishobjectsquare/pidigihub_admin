import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "./config/baseUrl";
import axios from "axios";
// import { ToastMessgae } from "./Component/utils/toast";

export default function Protected({ Component }) {
  const navigate = useNavigate();
  const [next, setNext] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem("token");
 
    if (!token) {
      navigate("/login");
      return;
    }

    // Check token validity if present
    // const checkToken = async () => {
    //   try {
    //     const response = await axios(`${baseUrl}/module/admin/token-check`, {
    //       method: "GET",
    //       headers: {
    //         Authorization: `Token ${token}`,
    //       },
    //     });

    //     if (response.data.code === 401) {
    //       localStorage.clear();
    //       navigate("/login");
    //       ToastMessgae({ message: "Please Login First" });
    //     } else {
    //       setNext(response.data.data || 0); // Set next state based on response
    //     }
    //   } catch (error) {
    //     console.error("Token validation error:", error);
    //     navigate("/login");
    //     ToastMessgae({ message: "An error occurred. Please try again." });
    //   }
    // };

    // checkToken();
  }, [navigate]);

  // Render the component only if the token is valid
  return (
    <>
      {next ? <Component /> : null}
    </>
  );
}
