"use client";

import { useAuthStore } from "@/lib/authStore";
import { useState, useEffect } from "react";

export default function HomeGreetings() {
  const userSession = useAuthStore((state) => state.userSession);
  const [greeting, setGreeting] = useState("Hello!");
  const [opacity, setOpacity] = useState(1);
  
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    let baseGreeting = "";
    
    if (currentHour < 12) baseGreeting = "Good morning";
    else if (currentHour < 18) baseGreeting = "Good afternoon";
    else baseGreeting = "Good evening";
    
    return userSession?.user?.user_metadata?.full_name 
      ? `${baseGreeting}, ${userSession.user.user_metadata.full_name.split(' ')[0]}`
      : baseGreeting;
  };

  useEffect(() => {
    setTimeout(() => {
      const newGreeting = getGreeting();
      setOpacity(0);
      setTimeout(() => {
        setGreeting(newGreeting);
        setOpacity(1);
      }, 200);
    }, 1000);
  }, [userSession]);

  return (
    <div className="text-center sm:text-left my-4 sm:mt-0">
      <h5 
        className="text-lg font-bold transition-opacity duration-400 ease-in-out"
        style={{ opacity }}
      >
        {greeting}
      </h5>
      <p className="text-sm">Welcome to darel's Projects</p>
    </div>
  );
}