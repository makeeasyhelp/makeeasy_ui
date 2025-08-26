
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => (
    <a 
        href="https://wa.me/918318250417?text=Hi%2C%20I%20want%20to%20book%20a%20service%20from%20MakeEasy.%20Please%20assist."
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-green-500/30 transition-all duration-300 flex items-center justify-center animate-bounce-subtle"
        target="_blank" 
        rel="noopener noreferrer" 
        aria-label="Chat on WhatsApp"
    >
        <MessageCircle size={24} />
    </a>
);

export default WhatsAppButton;
