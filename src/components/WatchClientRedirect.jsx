"use client";

import { useEffect } from "react";

export default function WatchClientRedirect() {
  useEffect(() => {
    if (window.location.hostname === process.env.NEXT_PUBLIC_APP_EXT_BASE_URL.slice(8)) {
      fetch(process.env.NEXT_PUBLIC_DARELISME_PING_URL)
        .then((pingResponse) => {
          if (!pingResponse.ok) {
            localStorage.setItem('redirectAfterSwitch', window.location.pathname + window.location.search);
            window.location.href = process.env.NEXT_PUBLIC_APP_LOCAL_BASE_URL + window.location.pathname + window.location.search;
          }
        })
        .catch(() => {
          localStorage.setItem('redirectAfterSwitch', window.location.pathname + window.location.search);
          window.location.href = process.env.NEXT_PUBLIC_APP_LOCAL_BASE_URL + window.location.pathname + window.location.search;
        });
    }
  }, []);
  return null;
}
