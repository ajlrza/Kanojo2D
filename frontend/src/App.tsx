import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import { postMessage, testMessage } from './Services/postMessage';

const App: Component = () => {
  let [displayChunk, setDisplayChunk] = createSignal("");
  let [userMessageDisplay, setUserMessageDisplay] = createSignal("");
  let [isTyping, setIsTyping] = createSignal(false);

  async function sendMessage(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    if (isTyping()) return;

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const message = formData.get("response_chat") as string;
    if (!message) return;

    setUserMessageDisplay(message);
    setDisplayChunk(""); // Reset for new message
    form.reset();

    const kurisuMessage = await postMessage("Okabe", message);
    if (kurisuMessage) {
      readMessage(kurisuMessage);
    }
  }

  async function readMessage(response: Response): Promise<void> {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    setIsTyping(true);

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const cleanedChunk = chunk.replace(/\n+/g, ' ');
      fullText += cleanedChunk;
      
      // Pass the full accumulated text to the display function
      await typewriter(fullText);
    }
    setIsTyping(false);
  }

  async function typewriter(targetText: string) {
    let current = displayChunk();
    const missingText = targetText.slice(current.length);
    
    for (const char of missingText) {
      current += char;
      setDisplayChunk(current);
      // Wait a tiny bit between characters for that VN feel
      await new Promise(r => setTimeout(r, 10)); 
    }
  }

  return (
    <div class="relative flex flex-col h-[100dvh] w-full bg-[#0a0a0c] bg-[url('/background.png')] bg-cover bg-center overflow-hidden font-sans text-gray-100 select-none pb-[env(safe-area-inset-bottom)]">
      
      {/* Scanline Effect */}
      <div class="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-10 opacity-20"></div>

      {/* Top HUD */}
      <div class="absolute top-6 left-6 z-20 flex items-center bg-black/40 border border-white/10 px-4 py-1 backdrop-blur-md">
        <div class="flex items-center gap-4 text-white font-mono tracking-widest text-xl">
          <span>8 / 1</span> <span class="text-sm tracking-normal opacity-60">(SUN)</span>
        </div>
      </div>

      {/* Character Sprite */}
      <div class="absolute inset-x-0 top-[5vh] pointer-events-none z-0 flex justify-center items-start">
        <img 
          src="./kurisu.png" 
          alt="Makise Kurisu" 
          class="h-[110dvh] sm:h-[130dvh] w-auto object-contain object-top drop-shadow-[0_0_30px_rgba(0,0,0,0.6)]"
        />
      </div>

      {/* Dialogue Overlay Container */}
      <div class="absolute bottom-0 left-0 right-0 z-30 flex flex-col bg-gradient-to-t from-black via-black/95 to-transparent pt-32 pb-6 px-6">
        
        {/* THE CHAT SECTION FIX: Centered max-width container */}
        <div class="flex flex-col gap-8 max-w-4xl w-full mx-auto mb-10">
          
          {/* Kurisu Message */}
          <div class={`flex flex-col self-start max-w-[85%] transition-opacity duration-300 ${displayChunk() ? 'opacity-100' : 'opacity-0'}`}>
            <h3 class="text-cyan-400 text-xs md:text-sm font-black mb-2 tracking-[0.3em] uppercase border-l-2 border-cyan-400 pl-3">
              Makise Kurisu
            </h3>
            <div class="text-lg md:text-2xl text-white font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,1)] leading-relaxed">
              {displayChunk()}
            </div>
          </div>

          {/* User Message */}
          <div class={`flex flex-col self-end text-right max-w-[70%] transition-opacity duration-300 ${userMessageDisplay() ? 'opacity-100' : 'opacity-0'}`}>
            <h3 class="text-gray-500 text-xs md:text-sm font-black mb-2 tracking-[0.3em] uppercase pr-3 border-r-2 border-gray-700">
              You
            </h3>
            <div class="text-base md:text-xl text-gray-300 italic font-medium drop-shadow-lg">
              "{userMessageDisplay()}"
            </div>
          </div>

        </div>

        {/* Input Form */}
        <form
          onSubmit={sendMessage}
          class="flex items-center gap-4 border-b border-white/20 pb-2 focus-within:border-cyan-500/50 transition-all max-w-4xl mx-auto w-full group">
          <input 
            type="text" 
            name="response_chat"
            autocomplete="off"
            placeholder={isTyping() ? "Wait for response..." : "Type your response..."}
            disabled={isTyping()}
            class="flex-1 bg-transparent text-gray-100 outline-none placeholder-gray-700 text-lg py-2 disabled:opacity-50"
          />
          <button 
            type="submit"
            class="text-gray-500 group-focus-within:text-cyan-400 hover:text-cyan-300 transition-colors uppercase text-sm font-black tracking-widest flex items-center gap-2">
            <span>Send</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </form>

        {/* Footer Navigation */}
        <div class="mt-6 flex justify-between items-center max-w-4xl mx-auto w-full text-[10px] text-gray-600 font-bold tracking-widest uppercase">
          <div class="flex gap-6">
            <button class="hover:text-white transition-colors">Change</button>
            <button class="hover:text-white transition-colors">Interact</button>
          </div>
          <div class="flex gap-6">
            <button class="hover:text-white transition-colors">History</button>
            <button class="hover:text-white transition-colors">Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;