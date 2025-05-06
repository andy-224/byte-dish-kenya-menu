
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bytedish-soft-gray">
      <div className="text-center p-6 max-w-md">
        <h1 className="text-6xl font-bold mb-4 text-bytedish-purple">404</h1>
        <p className="text-xl text-gray-600 mb-8">Oops! This page is not on the menu</p>
        <Button 
          className="bg-bytedish-purple hover:bg-bytedish-dark-purple flex items-center gap-2"
          onClick={() => navigate("/")}
        >
          <Home className="h-4 w-4" />
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
