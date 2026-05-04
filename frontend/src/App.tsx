import type { Component } from 'solid-js';
import { createEffect, createSignal } from 'solid-js';
import { postMessage, testMessage } from './Services/postMessage';

const App: Component = () => {
  let [responseChunk, setResponseChunk] = createSignal("");
  let [displayChunk, setDisplayChunk] = createSignal("");
  let [userMessageDisplay, setUserMessageDisplay] = createSignal("");

  async function sendMessage(e: SubmitEvent): Promise<void> {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;

    const formData = new FormData(form);
    const user = "Okabe"
    const message = formData.get("response_chat") as string;

    await testMessage(message);

    form.reset();
    
    const kurisuMessage: Response | undefined = await postMessage(user, message);
    if (kurisuMessage == undefined) {
       const messageRetry: Response | undefined = await postMessage(user, message);
    }
    if (kurisuMessage != undefined) {
        readMessage(kurisuMessage);
        setUserMessageDisplay(message);
    }
  }

  async function readMessage(kurisuMessage: Response | undefined): Promise<void> {

    if (!kurisuMessage || !kurisuMessage.body) {
        return undefined; 
      }

    if (kurisuMessage != undefined) {
        const kurisuReadMessageStream = kurisuMessage.body?.getReader();
        const streamDecoder = new TextDecoder();
        let cleanedText;

        while (true) {
          let {done, value}: any = await kurisuReadMessageStream?.read()
          let text = streamDecoder.decode(value)
          const cleanedText = text
          .replace(/\n+/g, ' ') 
          .replace(/\s{2,}/g, ' ') 
          .trim();
          setResponseChunk((prev) => prev.replace(/\n/g, "") + cleanedText)
          displayChunkFunction(responseChunk())
          if (done == true) {
            break;
            }
          }
        }
      }

    async function delay(ms: number): Promise<void> {
      return new Promise((resolve) => {
        setTimeout(resolve, ms)
      })
    }
    
    async function displayChunkFunction(kurisuMessage: String) {
      let chunkDisplay = ""

      for (const word of kurisuMessage.split(" ")) {
          chunkDisplay = chunkDisplay + " " + word
          
          await delay(20);

          setDisplayChunk(chunkDisplay)
      }
    }


  return (
    // h-[100dvh] ensures it fits exactly to the mobile browser's visible viewport
    <div class="relative flex flex-col h-[100dvh] w-full bg-[#0a0a0c] bg-[url('/background.png')] bg-cover bg-center overflow-hidden font-sans text-gray-100 select-none pb-[env(safe-area-inset-bottom)]">
      
      {/* Subtle CRT/Scanline effect overlay */}
      <div class="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-10 opacity-30"></div>

      {/* Top Left VN HUD */}
      <div class="absolute top-safe pt-2 pl-2 sm:top-6 sm:left-6 z-20 flex items-center bg-black/50 border border-gray-400/30 px-2 sm:px-4 py-1 sm:py-1.5 shadow-lg backdrop-blur-sm scale-90 sm:scale-100 origin-top-left">
        <div class="flex items-center gap-2 sm:gap-4 text-white font-mono tracking-widest text-base sm:text-xl">
          <span>8 / 1</span>
          <span class="text-xs sm:text-sm tracking-normal">(SUN)</span>
          
          <div class="flex items-center gap-1.5 sm:gap-2 ml-2 sm:ml-4 opacity-80">
            <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
            </svg>
            <div class="flex gap-[2px] h-2.5 sm:h-3 items-end">
              <div class="w-[3px] h-1.5 bg-white"></div>
              <div class="w-[3px] h-2 bg-white"></div>
              <div class="w-[3px] h-full bg-white"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Character Sprite Layer - FULL BODY ZOOM FIX */}
      {/* Anchored to top-10 to leave space above her head, flex-start so she hangs down */}
      <div class="absolute inset-x-0 top-[5vh] sm:top-[8vh] pointer-events-none z-0 flex justify-center items-start">
        <img 
          src="./kurisu.png" 
          alt="Makise Kurisu" 
          /* Changed from 100dvh to 140dvh+ for desktop. 
            Because she is full body, we OVER-scale the height to zoom the camera in.
            object-top ensures her head stays visible while her legs clip off the bottom.
          */
          class="h-[110dvh] sm:h-[130dvh] lg:h-[150dvh] w-auto max-w-none object-contain object-top drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] transition-all duration-300"
        />
      </div>

      {/* Visual Novel Dialogue Box Area */}
      <div class="absolute bottom-0 left-0 right-0 z-30 flex flex-col bg-gradient-to-t from-black via-black/95 to-transparent pt-32 pb-6 px-6">
        
        <div class="flex flex-col gap-8 max-w-4xl w-full mx-auto mb-10">
          
          <div class="flex flex-col self-start max-w-[85%] animate-fade-in">
            <h3 class="text-cyan-400 text-xs md:text-sm font-black mb-2 tracking-[0.3em] uppercase border-l-2 border-cyan-400 pl-3">
              Makise Kurisu
            </h3>
            <div class="text-lg md:text-2xl lg:text-3xl text-white font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,1)] leading-relaxed">
              {displayChunk()}
            </div>
          </div>

          <div class="flex flex-col self-end text-right max-w-[75%] animate-fade-in">
            <h3 class="text-gray-500 text-xs md:text-sm font-black mb-2 tracking-[0.3em] uppercase pr-3 border-r-2 border-gray-700">
              You
            </h3>
            <div class="text-base md:text-xl text-gray-300 italic font-medium drop-shadow-lg leading-snug">
              {userMessageDisplay()}
            </div>
          </div>

        </div>

        <form
        onSubmit={(e) => sendMessage(e)} 
        class="flex items-center gap-4 border-b border-white/20 pb-2 focus-within:border-cyan-500/50 transition-all max-w-4xl mx-auto w-full group">
          <input 
            type="text" 
            placeholder="Type your response..." 
            class="flex-1 bg-transparent text-gray-100 outline-none placeholder-gray-700 text-lg py-2"
          />
          <button type="submit" class="text-gray-500 group-focus-within:text-cyan-400 hover:text-cyan-300 transition-colors uppercase text-sm font-black tracking-widest flex items-center gap-2">
            <span>Send</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </form>

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