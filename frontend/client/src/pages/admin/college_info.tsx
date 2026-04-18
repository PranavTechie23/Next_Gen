import React from "react";
import { useLocation } from "wouter";

export default function CollegeInfo() {
  const [, navigate] = useLocation();
  
  return (
    <div className="min-h-dvh overflow-x-hidden px-4 py-6 sm:p-8">
      <h1 className="text-3xl font-bold mb-4">College Information</h1>
      <p className="text-muted-foreground">College information page - Coming soon</p>
    </div>
  );
}
