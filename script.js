const personas = [
  {
    name: "Elias",
    identity: "Christian theologian",
    tone: "gracious",
    style: "biblical reflection and practical wisdom"
  },
  {
    name: "Amina",
    identity: "Muslim scholar",
    tone: "thoughtful",
    style: "Qur'anic ethics and balanced reasoning"
  },
  {
    name: "Arjun",
    identity: "Hindu philosopher",
    tone: "reflective",
    style: "dharmic framing and nuanced debate"
  },
  {
    name: "Leah",
    identity: "Jewish rabbinic thinker",
    tone: "inquisitive",
    style: "text-rooted questions and ethical rigor"
  },
  {
    name: "Sofia",
    identity: "Interfaith moderator",
    tone: "calm",
    style: "bridging viewpoints and human-centered synthesis"
  }
];

const starters = [
  "Is compassion more important than justice, or can they never be separated?",
  "How should faith guide public life without controlling other people?",
  "Can suffering shape wisdom, or does it mostly wound us?",
  "Which matters more for character: intention, action, or consequences?",
  "What makes a disagreement sincere rather than performative?"
];

const reactions = {
  agree: ["That is a fair point.", "Well said.", "I can affirm that.", "I agree in part.", "That's a constructive view."],
  roast: [
    "Strong claim—can we ground it a bit more carefully?",
    "Bold argument, but it needs steadier footing.",
    "You're passionate, now let's sharpen the reasoning."
  ],
  flirt: [
    "There is real warmth in what you just said.",
    "That had grace and confidence together.",
    "A beautiful way to express a hard truth."
  ],
  challenge: [
    "Can you defend that with one concrete example?",
    "What principle supports that conclusion?",
    "Helpful claim—now test it against a hard case."
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
  if (/love|mercy|kindness|beauty|heart|grace/.test(t)) return "flirt";
  if (/wrong|ignorant|nonsense|roast|bad take/.test(t)) return "roast";
  if (/why|how|proof|evidence|principle|reason/.test(t)) return "challenge";
  return "agree";
}

function buildPersonaReply(persona, userText, direct = false) {
  const mood = inferMood(userText);
  const topic = cleanForAi(userText) || "that";

  const personaHooks = {
    Elias: [
      `From a Christian lens, ${topic} invites both truth and compassion; we should hold both.`,
      `When I hear ${topic}, I ask: does it move us toward love of God and neighbor?`
    ],
    Amina: [
      `In Islamic ethics, ${topic} asks us to balance justice, mercy, and intention.`,
      `On ${topic}, wisdom begins with humility: what do we know, and what are we assuming?`
    ],
    Arjun: [
      `In dharmic thought, ${topic} is less about winning and more about right action over time.`,
      `${pick(reactions.flirt)} I would ask whether ${topic} aligns with duty, conscience, and non-harm.`
    ],
    Leah: [
      `In Jewish study, ${topic} benefits from argument for the sake of heaven: rigorous but respectful.`,
      `${pick(reactions.challenge)} On ${topic}, I'd compare principles before conclusions.`
    ],
    Sofia: [
      `I hear valid tension in ${topic}; let's keep this deeply human and intellectually honest.`,
      `Across traditions, ${topic} asks not only \"What is true?\" but also \"What heals people?\"`
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
  postMessage("System", "Welcome to AI Scholar Circle. Mention a scholar with @name to get direct replies.");
  postMessage("Elias", "Shall we begin with a question: what does a good life require of us?");
  postMessage("Amina", "And as we discuss, may we keep adab—good character—at the center.");
  state.convoPulse = setInterval(maybeStartTopic, 4000);
}

boot();
