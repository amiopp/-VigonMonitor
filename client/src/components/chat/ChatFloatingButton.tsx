import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import ManagerAIChatbot from "@/components/dashboard/ManagerAIChatbot";

export default function ChatFloatingButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {!open && (
        <Button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
      {open && (
        <ManagerAIChatbot
          currency="USD"
          formatCurrency={(a) => `$${a.toLocaleString()}`}
          powerConsumption={{ totalUsage: 8.4 }}
          estimatedMonthlyCost={8.4 * 24 * 30 * 0.12}
        />
      )}
    </>
  );
}



