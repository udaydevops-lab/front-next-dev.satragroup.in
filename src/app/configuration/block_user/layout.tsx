import React from "react";

const BlockLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="w-full mx-auto max-w-7xl  position-relative">
        {children}
      </div>

    </>
  )
};

export default BlockLayout;
