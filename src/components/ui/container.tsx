import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className = "" }) => {
  return <div className={`mx-auto px-5 max-w-screen-xl w-full ${className}`}>{children}</div>;
};

export default Container;
