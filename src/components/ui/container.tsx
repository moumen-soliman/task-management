import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className = "" }: ContainerProps) {
  return <div className={`mx-auto px-5 max-w-screen-xl w-full ${className}`}>{children}</div>;
}
