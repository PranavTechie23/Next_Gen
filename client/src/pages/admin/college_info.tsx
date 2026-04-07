import React from "react";
import { useLocation } from "wouter";

export default function CollegeInfo() {
  const [, navigate] = useLocation();
  
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">College Information</h1>
      <p className="text-muted-foreground">College information page - Coming soon</p>
    </div>
  );
}
