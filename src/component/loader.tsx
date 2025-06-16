// components/Loader.tsx
import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="animate-spin h-10 w-10 text-white" />
        <span className="text-white text-lg">Please wait...</span>
      </div>
    </div>
  );
}
