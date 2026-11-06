// Funny page titles: [title, subtitle]. One is picked at random each time the page opens. Edit freely.
const T = {
  settings: [
    ["Your Cozy Corner 🛋️", "Get comfy and tweak things."],
    ["Tweak Central", "Knobs, switches and good vibes."],
    ["Make It Yours ✨", "Because default is boring."],
    ["The Control Panel of Destiny", "Choose wisely. Or don't, it's undoable."],
    ["Backstage Pass 🎟️", "Where the magic gets configured."],
    ["Fine-Tuning Time 🔧", "A little nudge here, a little nudge there."],
    ["Your Space, Your Rules", "SamS will adapt."],
    ["Settings (the fun part)", "Said nobody ever. Until now."],
    ["Under the Hood 🛠️", "Don't worry, nothing here bites."],
    ["All About You 👀", "Yes, you. Look at you."],
    ["Customization Station", "All aboard the personalization train 🚂"],
    ["The Vibe Check Room", "Make SamS match your energy."],
  ],
  admin: [
    ["The Control Room 🎛️", "Lots of buttons. Don't press them all."],
    ["Mission Control 🚀", "All systems... let's check."],
    ["Behind the Curtain", "Pay no attention to the workers."],
    ["Boss Mode: On 😎", "Everything's under control. Probably."],
    ["Server Whisperer 🧙", "Listening to the machines."],
    ["The Engine Room", "Where the gears turn."],
    ["Dashboard of Doom", "Hopefully not literally."],
    ["Big Brain Corner 🧠", "Numbers, queues and workers."],
  ],
};
export const pickTitle = (k) => T[k][Math.floor(Math.random() * T[k].length)];
