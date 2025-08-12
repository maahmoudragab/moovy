import { Alert, AlertTitle } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

export default function AlertComponent({ 
  showAlert, 
  isFavorite 
}: { 
  showAlert: boolean;
  isFavorite: boolean;
}) {
  return (
    <div className={`w-full fixed bottom-17 md:bottom-7 right-1/2 translate-x-1/2 z-45 transition-all duration-500
      ${showAlert ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"}`}>
      <Alert variant="default" className="w-fit mx-auto shadow-lg overflow-hidden flex items-center gap-2">
        <CheckCircle />
        <AlertTitle className="text-foreground w-full">
          {isFavorite ? "تمت الإضافة إلى المفضلة" : "تمت الإزالة من المفضلة"}
        </AlertTitle>
      </Alert>
    </div>
  );
}