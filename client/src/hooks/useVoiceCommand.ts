import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useVoiceCommand() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  const processVoiceMutation = useMutation({
    mutationFn: async (transcript: string) => {
      return apiRequest("POST", "/api/voice/process", { transcript });
    },
    onSuccess: (response) => {
      const data = response.json();
      toast({
        title: "Voice Command Processed",
        description: `Action: ${data.action}`,
      });
      // Here you would handle the intent and navigate/update UI accordingly
    },
    onError: () => {
      toast({
        title: "Voice Command Error",
        description: "Failed to process voice command",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const currentTranscript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");
        
        setTranscript(currentTranscript);

        // Process final result
        if (event.results[event.results.length - 1].isFinal) {
          processVoiceMutation.mutate(currentTranscript);
          setIsListening(false);
          setTranscript("");
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        setTranscript("");
        toast({
          title: "Voice Recognition Error",
          description: "Please try again",
          variant: "destructive",
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast, processVoiceMutation]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript("");
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setTranscript("");
    }
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported: typeof window !== "undefined" && "webkitSpeechRecognition" in window,
  };
}
