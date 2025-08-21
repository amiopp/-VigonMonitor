import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { useVoiceCommand } from "@/hooks/useVoiceCommand";

export default function VoiceCommandModal() {
  const { isListening, transcript, stopListening } = useVoiceCommand();

  return (
    <Dialog open={isListening} onOpenChange={() => stopListening()}>
      <DialogContent className="max-w-md">
        <div className="text-center">
          <div className="w-16 h-16 bg-vigon-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <Mic className="h-8 w-8 text-white animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Voice Command</h3>
          <p className="text-slate-600 mb-4">
            {transcript ? `"${transcript}"` : "Listening for your command..."}
          </p>
          <div className="space-y-2 text-sm text-slate-500 mb-6">
            <p>"Show WiFi performance for floor 2"</p>
            <p>"What was IPTV uptime last week?"</p>
            <p>"Display security camera status"</p>
          </div>
          <Button 
            onClick={stopListening}
            variant="destructive"
            className="bg-red-500 hover:bg-red-600"
          >
            Stop Listening
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
