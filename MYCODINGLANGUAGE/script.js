const IDE_KEY = "mycodinglanguage-ide-v5";
const DEFAULT_FILE = "main.mcl";
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

const editor = document.getElementById("editor");
const highlightLayer = document.getElementById("highlightLayer");
const consoleEl = document.getElementById("console");
const fileList = document.getElementById("fileList");
const tabs = document.getElementById("tabs");
const runBtn = document.getElementById("runBtn");
const newFileBtn = document.getElementById("newFileBtn");
const renameFileBtn = document.getElementById("renameFileBtn");
const deleteFileBtn = document.getElementById("deleteFileBtn");
const refreshFilesBtn = document.getElementById("refreshFilesBtn");
const formatBtn = document.getElementById("formatBtn");
const clearConsoleBtn = document.getElementById("clearConsoleBtn");
const connectCodesFolderBtn = document.getElementById("connectCodesFolderBtn");
const loadFromDiskBtn = document.getElementById("loadFromDiskBtn");
const saveToDiskBtn = document.getElementById("saveToDiskBtn");
const saveAllToDiskBtn = document.getElementById("saveAllToDiskBtn");
const exampleSelect = document.getElementById("exampleSelect");
const loadExampleBtn = document.getElementById("loadExampleBtn");

const STARTER_CODE = [
  "# MYCODINGLANGUAGE",
  "# Input happens in the console. Press Run Program and answer there.",
  "",
  "ask text name \"What is your name?\"",
  "ask number first \"First number:\"",
  "ask number second \"Second number:\"",
  "ask choice op [\"add\", \"subtract\", \"multiply\", \"divide\"] \"Choose operation:\"",
  "",
  "if op == \"add\"",
  "  answer = first + second",
  "else if op == \"subtract\"",
  "  answer = first - second",
  "else if op == \"multiply\"",
  "  answer = first * second",
  "else",
  "  answer = first / second",
  "end",
  "",
  "print \"Hi, {name}.\"",
  "print \"Answer:\", answer",
].join("\n");

const EXAMPLES = {
  "hello.mcl": [
    "# Variables, printing, and text templates",
    "let name = \"Sabit\"",
    "let coins = 10",
    "",
    "print \"Hello, {name}!\"",
    "print \"Coins now:\", coins",
    "set coins += 5",
    "print \"Coins after bonus:\", coins",
  ].join("\n"),
  "all-features-tour.mcl": [
    "# Full MYCODINGLANGUAGE feature tour",
    "# This one file demonstrates almost everything the language can do.",
    "import random, math, text, list, dict, time",
    "// Double slash comments also work.",
    "",
    "print \"== Output and variables ==\"",
    "let name = \"Coder\"",
    "let coins = 10",
    "say \"say works like print\"",
    "print \"Hello, {name}!\"",
    "set coins += 5",
    "print \"Coins:\", coins",
    "",
    "print \"== Console input ==\"",
    "ask player \"Universal ask - type anything:\"",
    "ask text favorite \"Favorite word:\"",
    "ask number age \"Age as a number:\"",
    "ask int lives \"Whole number of lives:\"",
    "ask yesno ready \"Are you ready?\"",
    "ask choice op [\"+\", \"-\", \"*\", \"/\"] \"Choose an operation:\"",
    "ask color from [\"red\", \"green\", \"blue\"] \"Pick a color:\"",
    "",
    "print \"Player:\", player",
    "print \"Favorite:\", text.upper(favorite)",
    "print \"Age next year:\", age + 1",
    "print \"Age modulo 2:\", age % 2",
    "print \"Lives:\", lives",
    "print \"Ready:\", ready",
    "print \"Operation:\", op",
    "print \"Color:\", color",
    "",
    "print \"== Input inside expressions ==\"",
    "quick = askNumber(\"Quick number:\")",
    "picked = choose(\"Pick a bonus:\", [5, 10, 20])",
    "print \"Quick total:\", quick + picked",
    "",
    "print \"== If, else if, else, logic ==\"",
    "if age >= 18 and ready",
    "  print \"Adult and ready\"",
    "else if age >= 13",
    "  print \"Teen\"",
    "else",
    "  print \"Young coder\"",
    "end",
    "",
    "if not ready",
    "  print \"No problem. You can still read the output.\"",
    "end",
    "",
    "print \"== elif and otherwise also work ==\"",
    "if color == \"red\"",
    "  print \"Warm color\"",
    "elif color == \"blue\"",
    "  print \"Cool color\"",
    "otherwise",
    "  print \"Balanced color\"",
    "end",
    "",
    "print \"== Lists, dictionaries, and loops ==\"",
    "let scores = [8, 10, 7]",
    "let user = {name: name, level: 2}",
    "print \"User level:\", user.level",
    "set user = dict.set(user, \"level\", 3)",
    "print \"Updated user:\", user",
    "",
    "for score in scores",
    "  print \"Score:\", score",
    "end",
    "",
    "repeat n in 1..3",
    "  print \"Range number:\", n",
    "end",
    "",
    "repeat 2",
    "  print \"Loop count:\", loop",
    "end",
    "",
    "let countdown = 3",
    "while countdown > 0",
    "  print \"Countdown:\", countdown",
    "  set countdown -= 1",
    "end",
    "",
    "print \"== break and continue ==\"",
    "repeat n in 1..5",
    "  if n == 2",
    "    continue",
    "  end",
    "  if n == 5",
    "    break",
    "  end",
    "  print \"Kept:\", n",
    "end",
    "",
    "print \"== Functions ==\"",
    "func calculate(a, b, symbol)",
    "  if symbol == \"+\"",
    "    return a + b",
    "  else if symbol == \"-\"",
    "    return a - b",
    "  else if symbol == \"*\"",
    "    return a * b",
    "  else",
    "    return a / b",
    "  end",
    "end",
    "",
    "print \"Function answer:\", calculate(12, 4, op)",
    "",
    "print \"== Built-ins and modules ==\"",
    "print \"len:\", len(scores)",
    "print \"str:\", str(123)",
    "print \"int:\", int(\"7\")",
    "print \"float:\", float(\"3.14\")",
    "print \"bool:\", bool(1)",
    "print \"type:\", type(scores)",
    "print \"range:\", range(1, 4)",
    "print \"math avg:\", math.avg(scores)",
    "print \"math clamp:\", math.clamp(120, 0, 100)",
    "print \"text words:\", text.words(\"learn code now\")",
    "print \"list first:\", list.first(scores)",
    "print \"list sorted:\", list.sort(scores)",
    "print \"dict keys:\", dict.keys(user)",
    "print \"random number:\", random.randint(1, 10)",
    "print \"time:\", time.clock()",
    "",
    "print \"== Wait / realtime output ==\"",
    "print \"Waiting half a second...\"",
    "wait 500",
    "print \"Done with the tour!\"",
  ].join("\n"),
  "console-controls.mcl": [
    "# Console control: input alias, wait, sleep, and clear",
    "print \"This line appears first.\"",
    "wait 500",
    "print \"This line appears after wait 500.\"",
    "sleep(500)",
    "print \"This line appears after sleep(500).\"",
    "",
    "input nickname \"Nickname using input alias:\"",
    "print \"Hello, {nickname}.\"",
    "",
    "ask yesno wipe \"Clear the console now?\"",
    "if wipe",
    "  clear",
    "  print \"Console was cleared.\"",
    "else",
    "  print \"Console was not cleared.\"",
    "end",
  ].join("\n"),
  "calculator-simple.mcl": [
    "# Calculator style 1: direct math",
    "ask number first \"First number:\"",
    "ask number second \"Second number:\"",
    "",
    "print \"Add:\", first + second",
    "print \"Subtract:\", first - second",
    "print \"Multiply:\", first * second",
    "print \"Divide:\", first / second",
  ].join("\n"),
  "calculator-menu.mcl": [
    "# Calculator style 2: ask the user what to do",
    "ask number first \"First number:\"",
    "ask number second \"Second number:\"",
    "ask choice op [\"+\", \"-\", \"*\", \"/\"] \"Operation:\"",
    "",
    "if op == \"+\"",
    "  print \"Answer:\", first + second",
    "else if op == \"-\"",
    "  print \"Answer:\", first - second",
    "else if op == \"*\"",
    "  print \"Answer:\", first * second",
    "else",
    "  print \"Answer:\", first / second",
    "end",
  ].join("\n"),
  "calculator-function.mcl": [
    "# Calculator style 3: reusable function",
    "func calculate(a, b, op)",
    "  if op == \"+\"",
    "    return a + b",
    "  else if op == \"-\"",
    "    return a - b",
    "  else if op == \"*\"",
    "    return a * b",
    "  else if op == \"/\"",
    "    return a / b",
    "  else",
    "    return \"Unknown operation\"",
    "  end",
    "end",
    "",
    "first = askNumber(\"First number:\")",
    "second = askNumber(\"Second number:\")",
    "op = choose(\"Operation:\", [\"+\", \"-\", \"*\", \"/\"])",
    "",
    "print \"Answer:\", calculate(first, second, op)",
  ].join("\n"),
  "receipt.mcl": [
    "# A small real-world program",
    "ask text item \"Item name:\"",
    "ask number price \"Price:\"",
    "ask number quantity \"Quantity:\"",
    "ask yesno hasTax \"Add 8% tax?\"",
    "",
    "subtotal = price * quantity",
    "if hasTax",
    "  total = subtotal * 1.08",
    "else",
    "  total = subtotal",
    "end",
    "",
    "print \"Receipt\"",
    "print \"Item:\", item",
    "print \"Subtotal:\", math.round(subtotal * 100) / 100",
    "print \"Total:\", math.round(total * 100) / 100",
  ].join("\n"),
  "guessing-game.mcl": [
    "# Guessing game with console input",
    "let secret = random.randint(1, 10)",
    "let tries = 0",
    "",
    "while tries < 3",
    "  ask number guess \"Guess 1 to 10:\"",
    "  set tries += 1",
    "",
    "  if guess == secret",
    "    print \"Correct!\"",
    "    break",
    "  else if guess < secret",
    "    print \"Too low.\"",
    "  else",
    "    print \"Too high.\"",
    "  end",
    "end",
    "",
    "print \"Secret was:\", secret",
  ].join("\n"),
  "quiz.mcl": [
    "# Quiz with typed input",
    "let points = 0",
    "",
    "ask number answer \"What is 5 + 7?\"",
    "if answer == 12",
    "  set points += 1",
    "  print \"Nice!\"",
    "else",
    "  print \"It was 12.\"",
    "end",
    "",
    "ask choice color [\"red\", \"green\", \"blue\"] \"Pick blue:\"",
    "if color == \"blue\"",
    "  set points += 1",
    "end",
    "",
    "print \"Points:\", points, \"/ 2\"",
  ].join("\n"),
  "lists-and-data.mcl": [
    "# Lists and dictionaries",
    "let scores = [84, 92, 71, 100]",
    "let user = {name: \"Sabit\", level: 3}",
    "let total = 0",
    "",
    "for score in scores",
    "  set total += score",
    "end",
    "",
    "print \"User:\", user.name",
    "print \"Scores:\", scores",
    "print \"Average:\", total / len(scores)",
    "print \"Best:\", math.max(...scores)",
    "print \"Sorted:\", list.sort(scores)",
  ].join("\n"),
  "gradebook.mcl": [
    "# Gradebook: collect scores and calculate an average",
    "let scores = []",
    "ask int count \"How many scores?\"",
    "",
    "repeat i in 1..count",
    "  ask number score \"Score {i}:\"",
    "  set scores = list.push(scores, score)",
    "end",
    "",
    "average = list.sum(scores) / len(scores)",
    "print \"Scores:\", scores",
    "print \"Average:\", math.round(average * 10) / 10",
    "",
    "if average >= 90",
    "  print \"Grade: A\"",
    "else if average >= 80",
    "  print \"Grade: B\"",
    "else if average >= 70",
    "  print \"Grade: C\"",
    "else",
    "  print \"Grade: Keep practicing\"",
    "end",
  ].join("\n"),
  "tip-calculator.mcl": [
    "# Tip calculator",
    "ask number bill \"Bill total:\"",
    "ask choice tipRate [10, 15, 18, 20, 25] \"Tip percent:\"",
    "",
    "tip = bill * tipRate / 100",
    "total = bill + tip",
    "",
    "print \"Tip:\", math.round(tip * 100) / 100",
    "print \"Total:\", math.round(total * 100) / 100",
  ].join("\n"),
  "unit-converter.mcl": [
    "# Unit converter",
    "ask choice mode [\"km to miles\", \"miles to km\", \"c to f\", \"f to c\"] \"Convert:\"",
    "ask number value \"Value:\"",
    "",
    "if mode == \"km to miles\"",
    "  print value, \"km =\", value * 0.621371, \"miles\"",
    "else if mode == \"miles to km\"",
    "  print value, \"miles =\", value * 1.60934, \"km\"",
    "else if mode == \"c to f\"",
    "  print value, \"C =\", value * 9 / 5 + 32, \"F\"",
    "else",
    "  print value, \"F =\", (value - 32) * 5 / 9, \"C\"",
    "end",
  ].join("\n"),
  "password-checker.mcl": [
    "# Password strength checker",
    "ask text password \"Create a password:\"",
    "let score = 0",
    "",
    "if len(password) >= 8",
    "  set score += 1",
    "end",
    "",
    "if len(password) >= 12",
    "  set score += 1",
    "end",
    "",
    "if text.contains(password, \"!\") or text.contains(password, \"?\") or text.contains(password, \"#\")",
    "  set score += 1",
    "end",
    "",
    "if score >= 3",
    "  print \"Strong password\"",
    "else if score == 2",
    "  print \"Okay password\"",
    "else",
    "  print \"Weak password\"",
    "end",
  ].join("\n"),
  "shopping-list.mcl": [
    "# Shopping list builder",
    "let items = []",
    "",
    "repeat 5",
    "  ask text item \"Add item, or type done:\"",
    "  if text.lower(item) == \"done\"",
    "    break",
    "  end",
    "  set items = list.push(items, item)",
    "end",
    "",
    "print \"Shopping list:\"",
    "for item in items",
    "  print \"-\", item",
    "end",
  ].join("\n"),
  "number-analyzer.mcl": [
    "# Number analyzer",
    "ask number n \"Type a number:\"",
    "",
    "print \"Number:\", n",
    "print \"Absolute:\", math.abs(n)",
    "print \"Rounded:\", math.round(n)",
    "print \"Square:\", n * n",
    "",
    "if n > 0",
    "  print \"Positive\"",
    "else if n < 0",
    "  print \"Negative\"",
    "else",
    "  print \"Zero\"",
    "end",
  ].join("\n"),
  "text-toolkit.mcl": [
    "# Text toolkit",
    "ask text message \"Type a sentence:\"",
    "",
    "print \"Original:\", message",
    "print \"Upper:\", text.upper(message)",
    "print \"Lower:\", text.lower(message)",
    "print \"Length:\", len(message)",
    "print \"Words:\", text.words(message)",
  ].join("\n"),
  "adventure-game.mcl": [
    "# Tiny adventure game",
    "print \"You are at a locked door.\"",
    "ask choice action [\"look\", \"knock\", \"open\"] \"What do you do?\"",
    "",
    "if action == \"look\"",
    "  print \"You find a small key under the mat.\"",
    "  print \"You unlock the door and win.\"",
    "else if action == \"knock\"",
    "  print \"Someone whispers: check the mat.\"",
    "else",
    "  print \"The door is locked.\"",
    "end",
  ].join("\n"),
  "countdown.mcl": [
    "# Realtime countdown",
    "ask int start \"Start number:\"",
    "",
    "while start > 0",
    "  print start",
    "  wait 500",
    "  set start -= 1",
    "end",
    "",
    "print \"Done!\"",
  ].join("\n"),
};

let state = {
  files: {
    [DEFAULT_FILE]: STARTER_CODE
  },
  activeFile: DEFAULT_FILE
};

let codesEstablishedHandle = null;
let isRunning = false;

class LanguageError extends Error {
  constructor(message, lineNumber = null) {
    super(message);
    this.lineNumber = lineNumber;
  }
}

function saveState() {
  localStorage.setItem(IDE_KEY, JSON.stringify(state));
}

function loadState() {
  const keys = [IDE_KEY, "mycodinglanguage-ide-v4", "mycodinglanguage-ide-v3"];
  for (const key of keys) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || "null");
      if (parsed && parsed.files && parsed.activeFile) {
        state = parsed;
        return;
      }
    } catch {}
  }
}

function currentCode() {
  return state.files[state.activeFile] ?? "";
}

function syncEditorToState() {
  state.files[state.activeFile] = editor.value;
  saveState();
  updateHighlight();
}

function openFile(fileName) {
  syncEditorToState();
  state.activeFile = fileName;
  editor.value = state.files[fileName];
  renderFiles();
  renderTabs();
  updateHighlight();
  saveState();
}

function renderFiles() {
  fileList.innerHTML = "";
  Object.keys(state.files).sort().forEach((file) => {
    const el = document.createElement("div");
    el.className = `file-item ${file === state.activeFile ? "active" : ""}`;
    el.textContent = file;
    el.onclick = () => openFile(file);
    fileList.appendChild(el);
  });
}

function renderTabs() {
  tabs.innerHTML = "";
  Object.keys(state.files).forEach((file) => {
    const tab = document.createElement("button");
    tab.className = `tab ${file === state.activeFile ? "active" : ""}`;
    tab.textContent = file;
    tab.onclick = () => openFile(file);
    tabs.appendChild(tab);
  });
}

function renderExamples() {
  if (!exampleSelect) return;
  exampleSelect.innerHTML = "";
  Object.keys(EXAMPLES).forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = prettyProjectName(name);
    exampleSelect.appendChild(option);
  });
}

function prettyProjectName(fileName) {
  return fileName
    .replace(/\.mcl$/i, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function ensureFileName(raw) {
  const cleaned = raw.trim().replace(/[\\/:*?"<>|]/g, "_");
  if (!cleaned) return null;
  return cleaned.endsWith(".mcl") ? cleaned : `${cleaned}.mcl`;
}

function uniqueFileName(fileName) {
  if (!state.files[fileName]) return fileName;

  const base = fileName.replace(/\.mcl$/i, "");
  let index = 2;
  let candidate = `${base}-${index}.mcl`;

  while (state.files[candidate]) {
    index += 1;
    candidate = `${base}-${index}.mcl`;
  }

  return candidate;
}

function formatCode(text) {
  const lines = text.split(/\r?\n/);
  let indent = 0;

  return lines.map((entry) => {
    const line = entry.trim();
    if (!line) return "";

    if (isMiddleBlock(line) || line === "end") {
      indent = Math.max(0, indent - 1);
    }

    const out = `${"  ".repeat(indent)}${line}`;

    if (isBlockStart(line) || isMiddleBlock(line)) {
      indent += 1;
    }

    return out;
  }).join("\n");
}

function isBlockStart(line) {
  return (
    line.startsWith("if ") ||
    line.startsWith("while ") ||
    line.startsWith("repeat ") ||
    line.startsWith("for ") ||
    line.startsWith("func ")
  );
}

function isMiddleBlock(line) {
  return line === "else" || line === "otherwise" || line.startsWith("else if ") || line.startsWith("elif ");
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function highlightSegment(segment) {
  let html = escapeHtml(segment);

  html = html.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, '<span class="syntax-string">$1</span>');
  html = html.replace(/\b(-?\d+(?:\.\d+)?)\b/g, '<span class="syntax-number">$1</span>');
  html = html.replace(/\b(print|say|ask|input|let|set|if|else|elif|otherwise|end|repeat|while|for|in|func|return|break|continue|and|or|not|true|false|null|nothing)\b/g, '<span class="syntax-keyword">$1</span>');
  html = html.replace(/\b(random|math|text|list|dict|time)\b/g, '<span class="syntax-module">$1</span>');
  html = html.replace(/\b(len|str|num|int|float|bool|type|range|askText|askNumber|askInt|askYesNo|choose|sleep)\b(?=\s*\()/g, '<span class="syntax-builtin">$1</span>');

  return html;
}

function highlightLine(line) {
  let quote = null;
  for (let i = 0; i < line.length; i += 1) {
    const c = line[i];
    const prev = line[i - 1];

    if ((c === "\"" || c === "'") && prev !== "\\") {
      quote = quote === c ? null : quote || c;
      continue;
    }

    if (!quote && c === "#") {
      return `${highlightSegment(line.slice(0, i))}<span class="syntax-comment">${escapeHtml(line.slice(i))}</span>`;
    }
    if (!quote && c === "/" && line[i + 1] === "/") {
      return `${highlightSegment(line.slice(0, i))}<span class="syntax-comment">${escapeHtml(line.slice(i))}</span>`;
    }
  }

  return highlightSegment(line);
}

function updateHighlight() {
  if (!highlightLayer) return;
  const html = editor.value.split(/\r?\n/).map(highlightLine).join("\n");
  highlightLayer.innerHTML = `${html}\n`;
  syncHighlightScroll();
}

function syncHighlightScroll() {
  if (!highlightLayer) return;
  highlightLayer.scrollTop = editor.scrollTop;
  highlightLayer.scrollLeft = editor.scrollLeft;
}

function writeLine(text, isError = false, isSystem = false) {
  const line = document.createElement("div");
  line.className = "console-line";
  if (isError) line.classList.add("error");
  if (isSystem) line.classList.add("system");
  line.textContent = formatValue(text);
  consoleEl.appendChild(line);
  consoleEl.scrollTop = consoleEl.scrollHeight;
}

function clearConsole() {
  consoleEl.innerHTML = "";
}

function parseUserInput(raw) {
  const text = (raw ?? "").trim();
  if (/^-?\d+(\.\d+)?$/.test(text)) return Number(text);
  if (/^(true|false|yes|no)$/i.test(text)) return ["true", "yes"].includes(text.toLowerCase());
  if (/^(null|none|nothing)$/i.test(text)) return null;
  return raw ?? "";
}

function parseConsoleInput(raw, type, choices = []) {
  const text = (raw ?? "").trim();

  if (type === "text") return { ok: true, value: raw ?? "" };
  if (type === "auto") return { ok: true, value: parseUserInput(raw) };

  if (type === "number") {
    if (/^-?\d+(\.\d+)?$/.test(text)) return { ok: true, value: Number(text) };
    return { ok: false, message: "Please type a number, like 42 or 3.14." };
  }

  if (type === "int") {
    if (/^-?\d+$/.test(text)) return { ok: true, value: Number(text) };
    return { ok: false, message: "Please type a whole number, like 7." };
  }

  if (type === "yesno") {
    if (["yes", "y", "true", "1"].includes(text.toLowerCase())) return { ok: true, value: true };
    if (["no", "n", "false", "0"].includes(text.toLowerCase())) return { ok: true, value: false };
    return { ok: false, message: "Please answer yes or no." };
  }

  if (type === "choice") {
    const optionNumber = Number(text);
    if (Number.isInteger(optionNumber) && optionNumber >= 1 && optionNumber <= choices.length) {
      return { ok: true, value: choices[optionNumber - 1] };
    }

    const found = choices.find((choice) => formatValue(choice).toLowerCase() === text.toLowerCase());
    if (found !== undefined) return { ok: true, value: found };

    return { ok: false, message: "Choose by number or exact option name." };
  }

  return { ok: true, value: parseUserInput(raw) };
}

function readConsoleInput(promptText = "", options = {}) {
  const type = options.type || "auto";
  const choices = Array.isArray(options.choices) ? options.choices : [];

  return new Promise((resolve) => {
    const block = document.createElement("div");
    block.className = "console-input-block";

    if (choices.length) {
      const menu = document.createElement("div");
      menu.className = "console-choice-menu";
      menu.textContent = choices.map((choice, index) => `${index + 1}. ${formatValue(choice)}`).join("\n");
      block.appendChild(menu);
    }

    const row = document.createElement("div");
    row.className = "console-prompt-row";

    const label = document.createElement("span");
    label.className = "console-prompt-label";
    label.textContent = `${promptText || "Input:"} `;

    const input = document.createElement("input");
    input.className = "console-user-input";
    input.autocomplete = "off";
    input.spellcheck = false;

    const helper = document.createElement("div");
    helper.className = "console-input-helper";

    function submit() {
      const parsed = parseConsoleInput(input.value, type, choices);
      if (!parsed.ok) {
        helper.textContent = parsed.message;
        input.focus();
        return;
      }

      input.disabled = true;
      helper.textContent = "";
      block.classList.add("answered");
      consoleEl.scrollTop = consoleEl.scrollHeight;
      resolve(parsed.value);
    }

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") submit();
    });

    row.appendChild(label);
    row.appendChild(input);
    block.appendChild(row);
    block.appendChild(helper);
    consoleEl.appendChild(block);
    consoleEl.scrollTop = consoleEl.scrollHeight;

    requestAnimationFrame(() => input.focus());
  });
}

function sleepMs(ms) {
  return new Promise((resolve) => setTimeout(resolve, Number(ms) || 0));
}

function yieldToBrowser() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function askText(promptText = "", fallback = "") {
  return readConsoleInput(promptText, { type: "text", fallback });
}

function askAuto(promptText = "", fallback = "") {
  return readConsoleInput(promptText, { type: "auto", fallback });
}

function askNumber(promptText = "", fallback = 0) {
  return readConsoleInput(promptText, { type: "number", fallback });
}

function askInt(promptText = "", fallback = 0) {
  return readConsoleInput(promptText, { type: "int", fallback });
}

function askYesNo(promptText = "", fallback = false) {
  return readConsoleInput(promptText, { type: "yesno", fallback });
}

function chooseOption(promptText = "Choose one:", choices = [], fallback = null) {
  const options = Array.isArray(choices) ? choices : String(choices).split(",").map((item) => item.trim()).filter(Boolean);
  return readConsoleInput(promptText, { type: "choice", choices: options, fallback });
}

function splitTopLevel(text, separatorChar) {
  const parts = [];
  let quote = null;
  let depth = 0;
  let current = "";

  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    const prev = text[i - 1];

    if ((c === "\"" || c === "'") && prev !== "\\") {
      quote = quote === c ? null : quote || c;
    }

    if (!quote) {
      if (c === "(" || c === "[" || c === "{") depth += 1;
      if (c === ")" || c === "]" || c === "}") depth = Math.max(0, depth - 1);
    }

    if (c === separatorChar && !quote && depth === 0) {
      parts.push(current.trim());
      current = "";
      continue;
    }

    current += c;
  }

  if (current.trim()) parts.push(current.trim());
  return parts;
}

function splitFirstExpression(text) {
  const source = text.trim();
  if (!source) return { first: "", rest: "" };

  const opener = source[0];
  const pairs = { "[": "]", "(": ")", "{": "}" };

  if (opener === "\"" || opener === "'") {
    for (let i = 1; i < source.length; i += 1) {
      if (source[i] === opener && source[i - 1] !== "\\") {
        return { first: source.slice(0, i + 1), rest: source.slice(i + 1).trim() };
      }
    }
  }

  if (pairs[opener]) {
    let depth = 0;
    let quote = null;
    for (let i = 0; i < source.length; i += 1) {
      const c = source[i];
      const prev = source[i - 1];

      if ((c === "\"" || c === "'") && prev !== "\\") {
        quote = quote === c ? null : quote || c;
        continue;
      }

      if (!quote) {
        if (c === opener) depth += 1;
        if (c === pairs[opener]) depth -= 1;
        if (depth === 0) {
          return { first: source.slice(0, i + 1), rest: source.slice(i + 1).trim() };
        }
      }
    }
  }

  let quote = null;
  let depth = 0;
  for (let i = 0; i < source.length; i += 1) {
    const c = source[i];
    const prev = source[i - 1];
    if ((c === "\"" || c === "'") && prev !== "\\") quote = quote === c ? null : quote || c;
    if (!quote) {
      if (c === "(" || c === "[" || c === "{") depth += 1;
      if (c === ")" || c === "]" || c === "}") depth = Math.max(0, depth - 1);
      if (/\s/.test(c) && depth === 0) {
        return { first: source.slice(0, i).trim(), rest: source.slice(i + 1).trim() };
      }
    }
  }

  return { first: source, rest: "" };
}

function stripComment(line) {
  let quote = null;

  for (let i = 0; i < line.length; i += 1) {
    const c = line[i];
    const prev = line[i - 1];

    if ((c === "\"" || c === "'") && prev !== "\\") {
      quote = quote === c ? null : quote || c;
      continue;
    }

    if (!quote && c === "#") return line.slice(0, i);
    if (!quote && c === "/" && line[i + 1] === "/") return line.slice(0, i);
  }

  return line;
}

function makeProgram(code) {
  return code.split(/\r?\n/).map((raw, index) => ({
    raw,
    line: stripComment(raw).trim(),
    lineNumber: index + 1
  }));
}

function fail(entry, message) {
  throw new LanguageError(message, entry?.lineNumber ?? null);
}

function formatValue(value) {
  if (value === null) return "null";
  if (value === undefined) return "nothing";
  if (Array.isArray(value)) return `[${value.map(formatValue).join(", ")}]`;
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function normalizeExpression(expr, env) {
  let out = expr.trim();
  if (out.startsWith("call ")) out = out.slice(5).trim();

  out = convertSimpleRange(out);
  out = out
    .replace(/\band\b/g, "&&")
    .replace(/\bor\b/g, "||")
    .replace(/\bnot\b/g, "!")
    .replace(/\byes\b/g, "true")
    .replace(/\bno\b/g, "false")
    .replace(/\bTrue\b/g, "true")
    .replace(/\bFalse\b/g, "false")
    .replace(/\bNone\b/g, "null")
    .replace(/\bnil\b/g, "null");

  const asyncNames = [
    "ask",
    "input",
    "askText",
    "askNumber",
    "askInt",
    "askYesNo",
    "choose",
    "sleep",
    ...Object.keys(env.functions)
  ];

  return addAwaitToCalls(out, asyncNames);
}

function addAwaitToCalls(expr, names) {
  const safeNames = names
    .filter(Boolean)
    .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  if (!safeNames.length) return expr;

  const pattern = new RegExp(`(^|[^\\w.])(${safeNames.join("|")})\\s*\\(`, "g");

  return expr.replace(pattern, (match, prefix, name, offset, full) => {
    const before = full.slice(0, offset + prefix.length);
    if (/await\s*$/.test(before)) return match;
    return `${prefix}await ${name}(`;
  });
}

function convertSimpleRange(expr) {
  let quote = null;
  let depth = 0;

  for (let i = 0; i < expr.length - 1; i += 1) {
    const c = expr[i];
    const prev = expr[i - 1];

    if ((c === "\"" || c === "'") && prev !== "\\") {
      quote = quote === c ? null : quote || c;
      continue;
    }

    if (!quote) {
      if (c === "(" || c === "[" || c === "{") depth += 1;
      if (c === ")" || c === "]" || c === "}") depth = Math.max(0, depth - 1);

      if (c === "." && expr[i + 1] === "." && depth === 0) {
        const left = expr.slice(0, i).trim();
        const right = expr.slice(i + 2).trim();
        if (left && right) return `rangeInclusive(${left}, ${right})`;
      }
    }
  }

  return expr;
}

async function evaluateStringLiteral(expr, env) {
  if (!/^"(?:[^"\\]|\\.)*"$/.test(expr) && !/^'(?:[^'\\]|\\.)*'$/.test(expr)) {
    return { matched: false, value: null };
  }

  const body = expr.slice(1, -1);
  const decoded = body
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, "\"")
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, "\\");

  let result = "";
  let lastIndex = 0;
  const pattern = /\{([^{}]+)\}/g;
  let match;

  while ((match = pattern.exec(decoded))) {
    result += decoded.slice(lastIndex, match.index);
    result += formatValue(await evaluateExpression(match[1], env));
    lastIndex = match.index + match[0].length;
  }

  result += decoded.slice(lastIndex);
  return { matched: true, value: result };
}

function buildBaseModules() {
  return {
    random: {
      random: () => Math.random(),
      randint: (min, max) => {
        const a = Number(min);
        const b = Number(max);
        return Math.floor(Math.random() * (b - a + 1)) + a;
      },
      randfloat: (min, max) => Number(min) + (Number(max) - Number(min)) * Math.random(),
      choice: (arr) => Array.isArray(arr) && arr.length ? arr[Math.floor(Math.random() * arr.length)] : null,
      shuffle: (arr) => {
        const out = Array.isArray(arr) ? [...arr] : [];
        for (let i = out.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          [out[i], out[j]] = [out[j], out[i]];
        }
        return out;
      }
    },
    time: {
      now: () => Date.now(),
      iso: () => new Date().toISOString(),
      seconds: () => Math.floor(Date.now() / 1000),
      date: () => new Date().toLocaleDateString(),
      clock: () => new Date().toLocaleTimeString()
    },
    math: {
      abs: (x) => Math.abs(Number(x)),
      pow: (a, b) => Math.pow(Number(a), Number(b)),
      sqrt: (x) => Math.sqrt(Number(x)),
      floor: (x) => Math.floor(Number(x)),
      ceil: (x) => Math.ceil(Number(x)),
      round: (x) => Math.round(Number(x)),
      min: (...args) => Math.min(...args.flat().map(Number)),
      max: (...args) => Math.max(...args.flat().map(Number)),
      clamp: (x, min, max) => Math.min(Math.max(Number(x), Number(min)), Number(max)),
      sum: (...args) => args.flat().map(Number).reduce((a, b) => a + b, 0),
      avg: (...args) => {
        const values = args.flat().map(Number);
        return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
      },
      average: (...args) => {
        const values = args.flat().map(Number);
        return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
      }
    },
    text: {
      upper: (s) => String(s).toUpperCase(),
      lower: (s) => String(s).toLowerCase(),
      trim: (s) => String(s).trim(),
      startsWith: (s, p) => String(s).startsWith(String(p)),
      endsWith: (s, p) => String(s).endsWith(String(p)),
      contains: (s, p) => String(s).includes(String(p)),
      replace: (s, a, b) => String(s).replaceAll(String(a), String(b)),
      split: (s, sep = "") => String(s).split(String(sep)),
      join: (arr, sep = "") => Array.isArray(arr) ? arr.join(String(sep)) : "",
      length: (s) => String(s).length,
      slice: (s, start, end) => String(s).slice(Number(start), end === undefined ? undefined : Number(end)),
      words: (s) => String(s).trim().split(/\s+/).filter(Boolean)
    },
    list: {
      len: (arr) => Array.isArray(arr) ? arr.length : 0,
      first: (arr) => Array.isArray(arr) && arr.length ? arr[0] : null,
      last: (arr) => Array.isArray(arr) && arr.length ? arr[arr.length - 1] : null,
      push: (arr, value) => [...(Array.isArray(arr) ? arr : []), value],
      pop: (arr) => Array.isArray(arr) ? arr.slice(0, -1) : [],
      reverse: (arr) => Array.isArray(arr) ? [...arr].reverse() : [],
      sort: (arr) => Array.isArray(arr) ? [...arr].sort((a, b) => (a > b ? 1 : a < b ? -1 : 0)) : [],
      sum: (arr) => Array.isArray(arr) ? arr.map(Number).reduce((a, b) => a + b, 0) : 0,
      contains: (arr, value) => Array.isArray(arr) ? arr.includes(value) : false,
      join: (arr, sep = ", ") => Array.isArray(arr) ? arr.join(String(sep)) : "",
      range: (start, end, step = 1) => makeRange(start, end, step, false)
    },
    dict: {
      keys: (obj) => obj && typeof obj === "object" && !Array.isArray(obj) ? Object.keys(obj) : [],
      values: (obj) => obj && typeof obj === "object" && !Array.isArray(obj) ? Object.values(obj) : [],
      has: (obj, key) => obj && typeof obj === "object" ? Object.prototype.hasOwnProperty.call(obj, key) : false,
      get: (obj, key, fallback = null) => obj && typeof obj === "object" && key in obj ? obj[key] : fallback,
      set: (obj, key, value) => ({ ...(obj || {}), [key]: value }),
      remove: (obj, key) => {
        const copy = { ...(obj || {}) };
        delete copy[key];
        return copy;
      },
      merge: (a, b) => ({ ...(a || {}), ...(b || {}) })
    }
  };
}

function buildBuiltins(env) {
  return {
    len: (x) => Array.isArray(x) || typeof x === "string" ? x.length : x && typeof x === "object" ? Object.keys(x).length : 0,
    str: (x) => formatValue(x),
    num: (x) => Number(x),
    int: (x) => parseInt(x, 10),
    float: (x) => parseFloat(x),
    bool: (x) => Boolean(x),
    type: (x) => Array.isArray(x) ? "list" : x === null ? "null" : typeof x,
    ask: askAuto,
    input: askAuto,
    askText,
    askNumber,
    askInt,
    askYesNo,
    choose: chooseOption,
    range: (start, end, step = 1) => makeRange(start, end, step, false),
    rangeInclusive: (start, end, step = 1) => makeRange(start, end, step, true),
    sleep: sleepMs
  };
}

function makeRange(start, end, step = 1, inclusive = false) {
  const out = [];
  const s = Number(step);
  if (s === 0) return out;

  const a = end === undefined ? 1 : Number(start);
  const b = end === undefined ? Number(start) : Number(end);

  if (s > 0) {
    for (let i = a; inclusive ? i <= b : i < b; i += s) out.push(i);
  } else {
    for (let i = a; inclusive ? i >= b : i > b; i += s) out.push(i);
  }

  return out;
}

function createContext(env) {
  const functions = {};

  Object.keys(env.functions).forEach((fnName) => {
    functions[fnName] = async (...args) => invokeFunction(fnName, args, env);
  });

  return {
    ...buildBuiltins(env),
    ...env.baseModules,
    ...functions,
    ...env.vars
  };
}

async function evaluateExpression(expr, env) {
  const raw = expr.trim();
  if (!raw) return null;

  const literal = await evaluateStringLiteral(raw, env);
  if (literal.matched) return literal.value;

  const normalized = normalizeExpression(raw, env);
  const context = createContext(env);

  try {
    return await AsyncFunction(...Object.keys(context), `"use strict"; return (${normalized});`)(...Object.values(context));
  } catch (err) {
    throw new LanguageError(`I could not understand this expression: ${expr}. ${err.message}`);
  }
}

function makeEnv() {
  return {
    vars: {},
    functions: {},
    imports: {},
    baseModules: buildBaseModules()
  };
}

function findBlock(program, startIndex) {
  let depth = 0;
  const middles = [];

  for (let i = startIndex; i < program.length; i += 1) {
    const line = program[i].line;
    if (!line) continue;

    if (isBlockStart(line)) depth += 1;
    if (isMiddleBlock(line) && depth === 1) middles.push(i);

    if (line === "end") {
      depth -= 1;
      if (depth === 0) return { endIndex: i, middles };
    }
  }

  fail(program[startIndex], `Missing "end" for this block.`);
}

async function executeRange(program, env, start = 0, end = program.length) {
  let i = start;

  while (i < end) {
    const entry = program[i];
    const line = entry.line;
    i += 1;

    if (!line || line === "end" || isMiddleBlock(line)) continue;

    try {
      if (line.startsWith("import ")) {
        runImport(entry, line, env);
        continue;
      }

      if (line.startsWith("print ") || line.startsWith("say ")) {
        const body = line.startsWith("print ") ? line.slice(6).trim() : line.slice(4).trim();
        await runPrint(body, env);
        continue;
      }

      if (line.startsWith("ask ")) {
        await runAsk(entry, line, env);
        continue;
      }

      if (line.startsWith("input ")) {
        await runAsk(entry, line.replace(/^input\s+/, "ask "), env);
        continue;
      }

      if (line.startsWith("wait ")) {
        await sleepMs(await evaluateExpression(line.slice(5), env));
        continue;
      }

      if (line === "clear") {
        clearConsole();
        continue;
      }

      if (line.startsWith("let ") || line.startsWith("set ")) {
        await runAssignment(entry, line, env);
        continue;
      }

      if (line.startsWith("if ")) {
        const block = findBlock(program, i - 1);
        const result = await runIf(program, env, i - 1, block);
        if (result) return result;
        i = block.endIndex + 1;
        continue;
      }

      if (line.startsWith("while ")) {
        const block = findBlock(program, i - 1);
        const result = await runWhile(program, env, i - 1, block);
        if (result?.returned) return result;
        i = block.endIndex + 1;
        continue;
      }

      if (line.startsWith("repeat ")) {
        const block = findBlock(program, i - 1);
        const result = await runRepeat(program, env, i - 1, block);
        if (result?.returned) return result;
        i = block.endIndex + 1;
        continue;
      }

      if (line.startsWith("for ")) {
        const block = findBlock(program, i - 1);
        const result = await runFor(program, env, i - 1, block);
        if (result?.returned) return result;
        i = block.endIndex + 1;
        continue;
      }

      if (line === "break") return { breakLoop: true };
      if (line === "continue") return { continueLoop: true };

      if (line.startsWith("func ")) {
        const block = findBlock(program, i - 1);
        runFunctionDeclaration(entry, line, program, i, block.endIndex, env);
        i = block.endIndex + 1;
        continue;
      }

      if (line.startsWith("return")) {
        const valueText = line.slice(6).trim();
        return { returned: true, returnedValue: valueText ? await evaluateExpression(valueText, env) : null };
      }

      if (await tryPlainAssignment(line, env)) continue;

      try {
        await evaluateExpression(line, env);
      } catch {
        fail(entry, `Unknown command: ${line}`);
      }
    } catch (err) {
      if (err instanceof LanguageError && !err.lineNumber) {
        err.lineNumber = entry.lineNumber;
      }
      throw err;
    }
  }

  return null;
}

function runImport(entry, line, env) {
  const modules = splitTopLevel(line.slice(7), ",");
  modules.forEach((modNameRaw) => {
    const modName = modNameRaw.trim();
    if (!(modName in env.baseModules)) fail(entry, `Unknown module: ${modName}`);
    env.imports[modName] = env.baseModules[modName];
  });
}

async function runPrint(body, env) {
  if (!body) {
    writeLine("");
    await yieldToBrowser();
    return;
  }

  const chunks = splitTopLevel(body, ",");
  const values = [];
  for (const chunk of chunks) {
    values.push(formatValue(await evaluateExpression(chunk, env)));
  }
  writeLine(values.join(" "));
  await yieldToBrowser();
}

async function runAsk(entry, line, env) {
  const typed = line.match(/^ask\s+(text|number|int|integer|yesno|yes\/no|bool|boolean)\s+([A-Za-z_][A-Za-z0-9_]*)\s*(.*)$/);
  if (typed) {
    const typeWord = typed[1];
    const name = typed[2];
    const promptExpr = typed[3] || `"${name}:"`;
    const type = normalizeAskType(typeWord);
    env.vars[name] = await readConsoleInput(formatValue(await evaluateExpression(promptExpr, env)), { type });
    return;
  }

  const choice = line.match(/^ask\s+choice\s+([A-Za-z_][A-Za-z0-9_]*)\s+(.+)$/);
  if (choice) {
    const name = choice[1];
    const split = splitFirstExpression(choice[2]);
    const choices = await evaluateExpression(split.first, env);
    const prompt = split.rest ? await evaluateExpression(split.rest, env) : `Choose ${name}:`;
    env.vars[name] = await chooseOption(formatValue(prompt), choices);
    return;
  }

  const fromChoice = line.match(/^ask\s+([A-Za-z_][A-Za-z0-9_]*)\s+from\s+(.+)$/);
  if (fromChoice) {
    const name = fromChoice[1];
    const split = splitFirstExpression(fromChoice[2]);
    const choices = await evaluateExpression(split.first, env);
    const prompt = split.rest ? await evaluateExpression(split.rest, env) : `Choose ${name}:`;
    env.vars[name] = await chooseOption(formatValue(prompt), choices);
    return;
  }

  const simple = line.match(/^ask\s+([A-Za-z_][A-Za-z0-9_]*)\s*(.*)$/);
  if (!simple) fail(entry, `Ask like this: ask name "What is your name?"`);
  const name = simple[1];
  const promptExpr = simple[2] || `"${name}:"`;
  env.vars[name] = await readConsoleInput(formatValue(await evaluateExpression(promptExpr, env)), { type: "auto" });
}

function normalizeAskType(typeWord) {
  if (typeWord === "integer") return "int";
  if (typeWord === "yes/no" || typeWord === "bool" || typeWord === "boolean") return "yesno";
  return typeWord;
}

async function runAssignment(entry, line, env) {
  const withoutKeyword = line.replace(/^(let|set)\s+/, "");
  await assignFromText(entry, withoutKeyword, env);
}

async function tryPlainAssignment(line, env) {
  const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*(=|\+=|-=|\*=|\/=|%=)\s*(.+)$/);
  if (!match) return false;
  await assignFromText({ lineNumber: null }, line, env);
  return true;
}

async function assignFromText(entry, text, env) {
  const match = text.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*(=|\+=|-=|\*=|\/=|%=)\s*(.+)$/);
  if (!match) fail(entry, `Assignment should look like: let score = 10 or set score += 1`);

  const [, name, op, expr] = match;
  const value = await evaluateExpression(expr, env);
  const current = env.vars[name] ?? 0;

  if (op === "=") env.vars[name] = value;
  if (op === "+=") env.vars[name] = current + value;
  if (op === "-=") env.vars[name] = current - value;
  if (op === "*=") env.vars[name] = current * value;
  if (op === "/=") env.vars[name] = current / value;
  if (op === "%=") env.vars[name] = current % value;
}

async function runIf(program, env, startIndex, block) {
  const branchStarts = [startIndex, ...block.middles];
  const branchEnds = [...block.middles, block.endIndex];

  for (let b = 0; b < branchStarts.length; b += 1) {
    const line = program[branchStarts[b]].line;
    let shouldRun = false;

    if (line.startsWith("if ")) shouldRun = Boolean(await evaluateExpression(line.slice(3).trim(), env));
    else if (line.startsWith("else if ")) shouldRun = Boolean(await evaluateExpression(line.slice(8).trim(), env));
    else if (line.startsWith("elif ")) shouldRun = Boolean(await evaluateExpression(line.slice(5).trim(), env));
    else if (line === "else" || line === "otherwise") shouldRun = true;

    if (shouldRun) {
      return executeRange(program, env, branchStarts[b] + 1, branchEnds[b]);
    }
  }

  return null;
}

async function runWhile(program, env, startIndex, block) {
  const condition = program[startIndex].line.slice(6).trim();
  let guard = 0;

  while (Boolean(await evaluateExpression(condition, env))) {
    guard += 1;
    if (guard > 100000) fail(program[startIndex], "Loop stopped because it ran too many times.");

    const result = await executeRange(program, env, startIndex + 1, block.endIndex);
    if (result?.returned) return result;
    if (result?.breakLoop) break;
    if (result?.continueLoop) continue;
  }

  return null;
}

async function runRepeat(program, env, startIndex, block) {
  const line = program[startIndex].line;
  const eachMatch = line.match(/^repeat\s+([A-Za-z_][A-Za-z0-9_]*)\s+in\s+(.+)$/);

  if (eachMatch) {
    const iterator = eachMatch[1];
    const values = await evaluateExpression(eachMatch[2], env);
    if (!Array.isArray(values)) fail(program[startIndex], "repeat name in ... needs a list or range.");

    for (const value of values) {
      env.vars[iterator] = value;
      const result = await executeRange(program, env, startIndex + 1, block.endIndex);
      if (result?.returned) return result;
      if (result?.breakLoop) break;
      if (result?.continueLoop) continue;
    }
    return null;
  }

  const count = Number(await evaluateExpression(line.slice(7).trim(), env));
  if (!Number.isFinite(count) || count < 0) fail(program[startIndex], "repeat needs a positive number.");

  for (let index = 1; index <= Math.floor(count); index += 1) {
    env.vars.loop = index;
    const result = await executeRange(program, env, startIndex + 1, block.endIndex);
    if (result?.returned) return result;
    if (result?.breakLoop) break;
    if (result?.continueLoop) continue;
  }

  return null;
}

async function runFor(program, env, startIndex, block) {
  const match = program[startIndex].line.match(/^for\s+([A-Za-z_][A-Za-z0-9_]*)\s+in\s+(.+)$/);
  if (!match) fail(program[startIndex], `For loops look like: for item in list`);

  const iterator = match[1];
  const values = await evaluateExpression(match[2], env);
  if (!Array.isArray(values)) fail(program[startIndex], "for needs a list or range.");

  for (const value of values) {
    env.vars[iterator] = value;
    const result = await executeRange(program, env, startIndex + 1, block.endIndex);
    if (result?.returned) return result;
    if (result?.breakLoop) break;
    if (result?.continueLoop) continue;
  }

  return null;
}

function runFunctionDeclaration(entry, line, program, bodyStart, bodyEnd, env) {
  const withParens = line.match(/^func\s+([A-Za-z_][A-Za-z0-9_]*)\((.*)\)$/);
  const simple = line.match(/^func\s+([A-Za-z_][A-Za-z0-9_]*)(?:\s+(.*))?$/);
  const match = withParens || simple;
  if (!match) fail(entry, `Function should look like: func add(a, b)`);

  const rawParams = (match[2] || "").trim();
  const params = rawParams ? splitTopLevel(rawParams, ",").map((p) => p.trim()).filter(Boolean) : [];

  env.functions[match[1]] = {
    params,
    bodyStart,
    bodyEnd,
    program
  };
}

async function invokeFunction(name, args, env) {
  const fn = env.functions[name];
  if (!fn) throw new LanguageError(`Function not found: ${name}`);

  const localEnv = {
    vars: { ...env.vars },
    functions: env.functions,
    imports: env.imports,
    baseModules: env.baseModules
  };

  fn.params.forEach((param, index) => {
    localEnv.vars[param] = args[index];
  });

  const result = await executeRange(fn.program, localEnv, fn.bodyStart, fn.bodyEnd);
  return result?.returned ? result.returnedValue : null;
}

async function connectCodesEstablishedFolder() {
  if (!("showDirectoryPicker" in window)) {
    writeLine("Use Chrome or Edge for folder write access.", true);
    return;
  }

  try {
    codesEstablishedHandle = await window.showDirectoryPicker();
    writeLine("Folder connected. Choose MYCODINGLANGUAGE/CodesEstablished.", false, true);
  } catch {
    writeLine("Folder connection canceled.", false, true);
  }
}

async function saveOneFileToDisk(fileName, code) {
  if (!codesEstablishedHandle) {
    writeLine("Connect CodesEstablished folder first.", true);
    return false;
  }

  try {
    const fh = await codesEstablishedHandle.getFileHandle(fileName, { create: true });
    const writable = await fh.createWritable();
    await writable.write(code);
    await writable.close();
    return true;
  } catch (err) {
    writeLine(`Save failed for ${fileName}: ${err.message}`, true);
    return false;
  }
}

async function loadFilesFromDisk() {
  if (!codesEstablishedHandle) {
    writeLine("Connect CodesEstablished folder first.", true);
    return;
  }

  try {
    let loaded = 0;
    let firstLoaded = null;

    for await (const [fileName, handle] of codesEstablishedHandle.entries()) {
      if (handle.kind !== "file" || !fileName.endsWith(".mcl")) continue;
      const file = await handle.getFile();
      state.files[fileName] = await file.text();
      firstLoaded = firstLoaded || fileName;
      loaded += 1;
    }

    if (firstLoaded) {
      state.activeFile = firstLoaded;
      editor.value = state.files[firstLoaded];
    }

    renderFiles();
    renderTabs();
    updateHighlight();
    saveState();
    writeLine(`Loaded ${loaded} .mcl file(s) from CodesEstablished.`, false, true);
  } catch (err) {
    writeLine(`Load failed: ${err.message}`, true);
  }
}

async function runProgram() {
  if (isRunning) return;

  syncEditorToState();
  clearConsole();
  writeLine("MYCODINGLANGUAGE Console", false, true);
  writeLine(`Running ${state.activeFile}...`, false, true);

  isRunning = true;
  runBtn.disabled = true;
  runBtn.textContent = "Running...";

  try {
    const program = makeProgram(editor.value);
    await executeRange(program, makeEnv());
    writeLine("Program completed successfully.", false, true);
  } catch (err) {
    const linePart = err.lineNumber ? `Line ${err.lineNumber}: ` : "";
    writeLine(`${linePart}${err.message}`, true);
  } finally {
    isRunning = false;
    runBtn.disabled = false;
    runBtn.textContent = "Run Program";
  }
}

editor.addEventListener("input", syncEditorToState);
editor.addEventListener("scroll", syncHighlightScroll);

newFileBtn.addEventListener("click", () => {
  const fileName = ensureFileName(window.prompt("New file name:", "newFile") || "");
  if (!fileName) return;
  if (state.files[fileName]) {
    writeLine(`File exists: ${fileName}`, true);
    return;
  }
  syncEditorToState();
  state.files[fileName] = '# New file\nprint "Start coding!"';
  openFile(fileName);
});

renameFileBtn.addEventListener("click", () => {
  const raw = window.prompt(`Rename "${state.activeFile}" to:`, state.activeFile.replace(".mcl", ""));
  if (!raw) return;
  const newName = ensureFileName(raw);
  if (!newName || newName === state.activeFile) return;
  if (state.files[newName]) {
    writeLine(`Cannot rename. ${newName} exists.`, true);
    return;
  }
  const code = currentCode();
  delete state.files[state.activeFile];
  state.files[newName] = code;
  state.activeFile = newName;
  editor.value = code;
  renderFiles();
  renderTabs();
  updateHighlight();
  saveState();
});

deleteFileBtn.addEventListener("click", () => {
  if (Object.keys(state.files).length === 1) {
    writeLine("At least one file must remain.", true);
    return;
  }
  if (!window.confirm(`Delete ${state.activeFile}?`)) return;
  delete state.files[state.activeFile];
  state.activeFile = Object.keys(state.files)[0];
  editor.value = currentCode();
  renderFiles();
  renderTabs();
  updateHighlight();
  saveState();
});

refreshFilesBtn.addEventListener("click", () => {
  renderFiles();
  renderTabs();
});

formatBtn.addEventListener("click", () => {
  editor.value = formatCode(editor.value);
  syncEditorToState();
  writeLine(`Formatted ${state.activeFile}`, false, true);
});

runBtn.addEventListener("click", runProgram);
clearConsoleBtn.addEventListener("click", clearConsole);
connectCodesFolderBtn.addEventListener("click", connectCodesEstablishedFolder);
loadFromDiskBtn.addEventListener("click", loadFilesFromDisk);

saveToDiskBtn.addEventListener("click", async () => {
  syncEditorToState();
  if (await saveOneFileToDisk(state.activeFile, currentCode())) {
    writeLine(`Saved ${state.activeFile} to CodesEstablished.`, false, true);
  }
});

saveAllToDiskBtn.addEventListener("click", async () => {
  syncEditorToState();
  let success = 0;
  const names = Object.keys(state.files);
  for (const fileName of names) {
    if (await saveOneFileToDisk(fileName, state.files[fileName])) success += 1;
  }
  writeLine(`Saved ${success}/${names.length} files to CodesEstablished.`, false, true);
});

if (loadExampleBtn && exampleSelect) {
  loadExampleBtn.addEventListener("click", () => {
    const fileName = exampleSelect.value;
    if (!fileName || !(fileName in EXAMPLES)) return;
    syncEditorToState();
    const newName = uniqueFileName(fileName);
    state.files[newName] = EXAMPLES[fileName];
    openFile(newName);
    writeLine(`Added starter project: ${newName}`, false, true);
  });
}

loadState();
renderExamples();
editor.value = currentCode();
renderFiles();
renderTabs();
updateHighlight();
writeLine("IDE ready. Input will appear directly inside this console.", false, true);
