const personas = [
  {
    name: "Nova",
    identity: "Visionary founder",
    tone: "ambitious",
    style: "future-focused one-liners"
  },
  {
    name: "Blaze",
    identity: "Chaotic roast comic",
    tone: "playful",
    style: "friendly teasing and punchlines"
  },
  {
    name: "Lyra",
    identity: "Poetic romantic",
    tone: "flirty",
    style: "metaphors and warm charm"
  },
  {
    name: "Cipher",
    identity: "Analyst hacker",
    tone: "sharp",
    style: "logic-first tactical replies"
  },
  {
    name: "Moss",
    identity: "Zen therapist",
    tone: "grounded",
    style: "calm insight and emotional balance"
  }
];

const starters = [
  "Hot take: best business idea under $100 to launch this week?",
  "What's more important in life: consistency or intensity?",
  "If we could teleport for one day, where are we going?",
  "Debate time: AI should have personalities by default—yes or no?",
  "Someone pitch a wild side hustle in 12 words."
];

const reactions = {
  agree: ["facts", "100%", "you cooked", "valid point", "co-signed"],
  roast: [
    "That confidence is loud for such a suspicious plan 😌",
    "Respectfully, that's chaos in a hoodie.",
    "I support your dream and fear its consequences."
  ],
  flirt: [
    "Okay, that answer had dangerous levels of charm.",
    "You really just walked in and raised the room's temperature.",
    "Not me taking notes because that was smooth."
  ],
  challenge: [
    "Counterpoint: what happens when reality refuses that plan?",
    "I like it, but define success in one measurable metric.",
    "Bold. Now defend it with data, not vibes."
  ]
};

const state = {
  lastTopicAt: Date.now(),
  convoPulse: null,
  topicPulse: null,
  history: []
};

const rosterEl = document.querySelector("#roster");
const chatLog = document.querySelector("#chatLog");
const chatInput = document.querySelector("#chatInput");
const chatForm = document.querySelector("#chatForm");
const clearBtn = document.querySelector("#clear");
const autoTopic = document.querySelector("#autotopic");
const messageTpl = document.querySelector("#messageTpl");

function formatTime(date = new Date()) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function renderRoster() {
  rosterEl.innerHTML = "";
  personas.forEach((p) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>@${p.name}</strong><span>${p.identity} · ${p.style}</span>`;
    rosterEl.append(li);
  });
}

function postMessage(speaker, text) {
  const node = messageTpl.content.firstElementChild.cloneNode(true);
  node.dataset.speaker = speaker;
  node.querySelector(".name").textContent = speaker;
  node.querySelector("time").textContent = formatTime();
  node.querySelector(".body").textContent = text;
  chatLog.append(node);
  chatLog.scrollTop = chatLog.scrollHeight;

  state.history.push({ speaker, text, at: Date.now() });
  if (state.history.length > 120) state.history.shift();
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function cleanForAi(text) {
  return text.replace(/@\w+/g, "").trim();
}

function inferMood(text) {
  const t = text.toLowerCase();
  if (/love|cute|date|romance|flirt|heart/.test(t)) return "flirt";
  if (/bad|stupid|dumb|weak|roast|cringe/.test(t)) return "roast";
  if (/why|how|proof|evidence|metric|data/.test(t)) return "challenge";
  return "agree";
}

function buildPersonaReply(persona, userText, direct = false) {
  const mood = inferMood(userText);
  const topic = cleanForAi(userText) || "that";

  const personaHooks = {
    Nova: [
      `Let's turn ${topic} into a 7-day experiment and ship fast.`,
      `I'm seeing product potential in ${topic}; who's building first?`
    ],
    Blaze: [
      `${pick(reactions.roast)} But okay, ${topic} could still slap.`,
      `If ${topic} were a person it'd definitely skip leg day.`
    ],
    Lyra: [
      `${pick(reactions.flirt)} Also, ${topic} feels like a moonlit conversation.`,
      `Soft take: ${topic} deserves curiosity, not cynicism.`
    ],
    Cipher: [
      `Threading logic: claim -> evidence -> action. Start with ${topic}.`,
      `${pick(reactions.challenge)} For ${topic}, I'd run A/B tests first.`
    ],
    Moss: [
      `Pause, breathe—what do you *want* from ${topic}, not just what sounds cool?`,
      `I hear energy around ${topic}. Let's keep it playful and kind.`
    ]
  };

  let base = pick(personaHooks[persona.name]) || `${pick(reactions[mood])} on ${topic}.`;

  if (direct) {
    base = `@You ${base}`;
  } else if (Math.random() < 0.25) {
    const target = pick(personas.filter((p) => p.name !== persona.name));
    base = `@${target.name} ${base}`;
  }

  return base;
}

function findMentions(text) {
  const tags = [...text.matchAll(/@(\w+)/g)].map((m) => m[1].toLowerCase());
  return personas.filter((p) => tags.includes(p.name.toLowerCase()));
}

function queueReply(persona, text, direct = false, delay = 400) {
  setTimeout(() => {
    postMessage(persona.name, buildPersonaReply(persona, text, direct));
    triggerObservers(persona, text);
  }, delay + Math.random() * 650);
}

function triggerObservers(activePersona, originText) {
  const listeners = personas.filter((p) => p.name !== activePersona.name);
  const count = Math.random() < 0.55 ? 2 : 1;
  for (let i = 0; i < count; i += 1) {
    const p = listeners[Math.floor(Math.random() * listeners.length)];
    setTimeout(() => {
      const observed = `Saw ${activePersona.name}'s point on "${cleanForAi(originText).slice(0, 60)}".`;
      postMessage(p.name, buildPersonaReply(p, observed, false));
    }, 900 + Math.random() * 1000 + i * 250);
  }
}

function handleUserMessage(text) {
  postMessage("You", text);
  state.lastTopicAt = Date.now();

  const mentions = findMentions(text);
  if (mentions.length > 0) {
    mentions.forEach((persona, idx) => queueReply(persona, text, true, 250 + idx * 300));
    const others = personas.filter((p) => !mentions.some((m) => m.name === p.name));
    if (others.length) queueReply(pick(others), `Observing: ${text}`, false, 1200);
    return;
  }

  const starter = pick(personas);
  queueReply(starter, text, true, 280);
}

function maybeStartTopic() {
  if (!autoTopic.checked) return;
  const quietFor = Date.now() - state.lastTopicAt;
  if (quietFor < 15000) return;

  const starter = pick(personas);
  const topic = pick(starters);
  postMessage(starter.name, topic);
  state.lastTopicAt = Date.now();
  triggerObservers(starter, topic);
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  handleUserMessage(text);
  chatInput.value = "";
});

clearBtn.addEventListener("click", () => {
  chatLog.innerHTML = "";
  state.history = [];
  postMessage("System", "Chat cleared. The squad is ready for a new vibe.");
});

function boot() {
  renderRoster();
  postMessage("System", "Welcome to AI Squad Lounge. Mention a character with @name to get direct replies.");
  postMessage("Nova", "Who's ready to build something chaotic and legendary today?");
  postMessage("Blaze", "If it's not mildly unhinged, is it even a plan?");
  state.convoPulse = setInterval(maybeStartTopic, 4000);
}

boot();
