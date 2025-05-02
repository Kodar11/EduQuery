import React from "react";

const Card = ({ children }) => {
  return <div className="border rounded-lg shadow p-4 flex w-3xl m-2">{children}</div>;
};

export default Card;