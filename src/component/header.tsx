import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed } from "lucide-react";

const DashboardHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 shadow-none">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="text-white text-2xl" size={28} />
          <h1 className="text-xl font-bold text-white">
            Meal Count
          </h1>
        </div>

        <Button
          variant="outline"
          onClick={handleLogout}
          className="border-white text-white bg-transparent hover:bg-white/10 hover:text-white hover:border-white"
        >
          Logout
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;