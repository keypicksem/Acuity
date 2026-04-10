"use client";

import { useEffect } from "react";

export function TrackCompleteRegistration() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "CompleteRegistration");
    }
  }, []);

  return null;
}
