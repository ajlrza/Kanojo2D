import type { Component } from 'solid-js';
import { createEffect, createSignal } from 'solid-js';
import { postMessage } from './Services/postMessage';

const App: Component = () => {
  let [responseChunk, setResponseChunk] = createSignal("");
  let [displayChunk, setDisplayChunk] = createSignal("");

  async function sendMessage(e: SubmitEvent): Promise<void> {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;

    const formData = new FormData(form);
    const user = "Okabe"
    const message = formData.get("response_chat") as string;

    form.reset();
    
    const kurisuMessage: Response | undefined = await postMessage(user, message);
    if (kurisuMessage == undefined) {
       const messageRetry: Response | undefined = await postMessage(user, message);
    }
    if (kurisuMessage != undefined) {
        readMessage(kurisuMessage);
    }
  }

  async function readMessage(kurisuMessage: Response | undefined): Promise<void> {

    if (!kurisuMessage || !kurisuMessage.body) {
        return undefined; 
      }

    if (kurisuMessage != undefined) {
        const kurisuReadMessageStream = kurisuMessage.body?.getReader();
        const streamDecoder = new TextDecoder();

        while (true) {
            let {done, value}: any = await kurisuReadMessageStream?.read()
            if (done == false) {
              let text = streamDecoder.decode(value)
              typeMessage(text);
            }
            if (done == true) {
              break;
            }
        }
      }
  }


  function typeMessage(kurisuMessage: string): void {
      let prevResponseChunk = responseChunk()
      
      const delayMessage = setInterval(() => {
        setResponseChunk((prev) => prev + kurisuMessage)
        if (responseChunk().length > prevResponseChunk.length) {
          clearInterval(delayMessage)
        }
      }, 1000)
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
      <div class="absolute bottom-0 left-0 right-0 z-30 flex flex-col pointer-events-auto">
        
        {/* Main Text Box */}
        <div class="w-full bg-gradient-to-t from-black via-black/90 to-transparent pt-16 sm:pt-20 pb-4 sm:pb-8 px-4 sm:px-8 md:px-16 lg:px-32">
          
          <h3 class="text-cyan-400 text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-3 drop-shadow-md tracking-wider uppercase">
            Makise Kurisu
          </h3>
          
          <div class="text-[8px] sm:text-xl md:text-2xl lg:text-[28px] text-white font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,1)] leading-snug sm:leading-relaxed">
            {responseChunk()}
          </div>

          <form
           onSubmit={(e) => sendMessage(e)}
           class="mt-4 sm:mt-8 flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 border-b border-white/20 pb-2 focus-within:border-cyan-400 transition-colors">
            <span class="hidden sm:inline text-gray-500 font-bold text-[10px] sm:text-xs tracking-[0.2em] uppercase shrink-0">You</span>
            <input 
              type="text" 
              name="response_chat"
              placeholder="Type your response..." 
              class="flex-1 w-full sm:w-auto bg-transparent text-gray-200 outline-none placeholder-gray-600 text-base sm:text-lg drop-shadow-md min-w-[150px]"
            />
            <button class="text-gray-400 hover:text-cyan-400 transition-colors uppercase text-xs sm:text-sm font-bold tracking-widest flex items-center gap-1 sm:gap-2 p-2 sm:p-0 ml-auto shrink-0">
              <span class="hidden sm:inline">Send</span> 
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </form>
        </div>

        {/* Bottom Menu Bar */}
        <div class="w-full bg-black border-t border-white/10 px-4 sm:px-6 py-2 flex items-center gap-4 sm:gap-6 text-[9px] sm:text-[10px] md:text-xs text-gray-500 font-bold tracking-widest overflow-x-auto no-scrollbar pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
          <button class="hover:text-white transition-colors flex items-center gap-1.5 shrink-0">
            CHANGE
          </button>
          <button class="hover:text-white transition-colors flex items-center gap-1.5 shrink-0">
            INTERACT MORE
          </button>
          
          <div class="flex-1 min-w-[20px]"></div>

          <button class="hover:text-white transition-colors shrink-0">HISTORY</button>
          <button class="hover:text-white transition-colors shrink-0">SETTINGS</button>
        </div>
        
      </div>
    </div>
  );
};

export default App;