"use client";

import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";
import { useEffect } from "react";

// Configure immediately when module loads
if (typeof window !== 'undefined') {
  try {
    Amplify.configure(outputs);
    console.log("✅ Amplify configured via ConfigureAmplify.tsx");
  } catch (e) {
    console.error("Failed to configure Amplify:", e);
  }
}

export default function ConfigureAmplifyClientSide() {
  return null;
}
