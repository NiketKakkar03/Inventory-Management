// components/VoiceCommands.js
import { useEffect } from 'react';

export default function VoiceCommands() {
  useEffect(() => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      if (command.includes('add item')) {
        // Handle add item
      } else if (command.includes('remove item')) {
        // Handle remove item
      }
    };

    recognition.start();

    return () => {
      recognition.stop();
    };
  }, []);

  return <div>Listening for commands...</div>;
}
