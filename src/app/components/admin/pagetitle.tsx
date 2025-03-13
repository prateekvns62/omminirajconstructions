import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Loader from "./loader";

interface PageTitleProps {
  title: React.ReactNode;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  const router = useRouter();
  const pathname = usePathname() || "/dashboard";
  const [previousUrl, setPreviousUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let historyStack: string[] = JSON.parse(sessionStorage.getItem("historyStack") || "[]");

    if (historyStack.length === 0 || historyStack[historyStack.length - 1] !== pathname) {
      historyStack.push(pathname);
      sessionStorage.setItem("historyStack", JSON.stringify(historyStack));
    }

    setPreviousUrl(historyStack.length > 1 ? historyStack[historyStack.length - 2] : null);
  }, [pathname]);

  const handleBack = () => {
    setLoading(true);
    let historyStack: string[] = JSON.parse(sessionStorage.getItem("historyStack") || "[]");

    if (historyStack.length > 1) {
      historyStack.pop(); // Remove current page
      const prevPage = historyStack[historyStack.length - 1]; // Get new previous page
      sessionStorage.setItem("historyStack", JSON.stringify(historyStack));
      router.push(prevPage);
    } else {
      router.push("/admin"); // Fallback to dashboard if no history exists
    }
  };

  useEffect(() => {
    setLoading(false); // Stop loading when route changes
  }, [pathname]);

  return (
    <>
    <div className="flex justify-between items-center py-4 border-b mx-4">
      <h4 className="text-2xl font-bold">{title}</h4>
      <button
        onClick={handleBack}
        className="flex items-center space-x-2 text-blue-600 hover:underline"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>
    </div>
    {loading && (
      <Loader/>
    )}
  </>
  );
};

export default PageTitle;