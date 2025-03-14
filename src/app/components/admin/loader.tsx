import { useEffect } from "react";

const Loader = () => {
  useEffect(() => {
    // Store the current scroll position
    const scrollY = window.scrollY;

    // Prevent scrolling
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = `-${scrollY}px`;

    return () => {
      // Restore scroll position
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("position");
      document.body.style.removeProperty("width");
      document.body.style.removeProperty("top");
      window.scrollTo(0, scrollY);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="w-16 h-16 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin shadow-lg"></div>
    </div>
  );
};

export default Loader;
