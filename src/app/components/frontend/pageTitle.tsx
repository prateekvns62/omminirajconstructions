import React from "react";

interface PageTitleProps {
  title: string;
  backgroundImage?: string; // Optional prop
}

const PageTitle: React.FC<PageTitleProps> = ({ title, backgroundImage }) => {
  const defaultBackground = "/default-title-bg.jpg";

  return (
    <div
      className="relative w-full h-32 md:h-64 flex items-center justify-center text-center text-black font-bold text-xl md:text-3xl"
      style={{
        backgroundImage: `url(${backgroundImage || defaultBackground})`,
        backgroundSize: "cover",
      }}
    >
      {/* Yellow Overlay */}
      <div className="absolute inset-0 bg-yellow-500 opacity-80"></div>

      {/* Title Text */}
      <h2 className="relative z-10 md:text-5xl text-2xl">{title}</h2>
    </div>
  );
};

export default PageTitle;
