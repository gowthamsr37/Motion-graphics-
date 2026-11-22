// Builds content/posts.json (504 post specs) and content/CAPTIONS.md from the topic library.
// Order: 7 rounds over 72 topics; each topic gets every format once, and neighbouring posts differ in topic and format.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import t1 from "../content/topics-1.mjs";
import t2 from "../content/topics-2.mjs";
import t3 from "../content/topics-3.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TOPICS = [...t1, ...t2, ...t3];
const FORMATS = ["pile", "squiggle", "iceberg", "compound", "valley", "bamboo", "domino"];
const fmt = (n) => n.toLocaleString("en-US");
const pick = (arr, k) => arr[k % arr.length];
const fill = (s, t) => s.replace(/\{(\w+)\}/g, (_, k) => (k === "c" ? fmt(t.c) : t[k]));

const END = {
  pile: [["Everyone wants the result.", "Nobody sees *the {c} {u}*."], ["Miss. Miss. Miss.", "*Then* it goes in."], ["The pile is the *proof*.", "Keep throwing."], ["They'll see one shot.", "You'll know about *the {c}*."], ["Every miss is a step", "*towards the hit*."], ["Nobody gets it first try.", "*Keep throwing.*"]],
  squiggle: [["Nobody's path is *straight*.", "Don't quit in the loops."], ["The mess *is* the path.", "Keep drawing the line."], ["You're not lost.", "You're in *the loops*."], ["Success is a *scribble*.", "Keep your pen moving."], ["They show the arrow.", "Nobody shows *the scribble*."], ["Setbacks aren't detours.", "They're *the road*."]],
  iceberg: [["They see *{see}*.", "They don't see the cost."], ["Success is an *iceberg*.", "Most of it is underwater."], ["Overnight success?", "It took *years* of nights."], ["Don't compare your start", "to someone's *tip of the iceberg*."], ["The work nobody sees", "is *the work that counts*."], ["Everyone admires the tip.", "Respect *what's underneath*."]],
  compound: [["*1%* a day.", "That's all it takes."], ["Small steps, *every day*.", "They add up faster than you think."], ["Don't wait for big changes.", "Make *tiny* ones daily."], ["Nothing changes on day 1.", "Everything changes by *day 365*."], ["Tiny habits.", "*Massive* results."], ["You don't need more time.", "You need *a little, daily*."]],
  valley: [["The results are *coming*.", "Don't quit in the valley."], ["Progress feels like nothing", "until it's *everything*."], ["Most people quit", "*right before* it works."], ["Feeling stuck?", "You might be *almost there*."], ["The curve always bends.", "*Stay* for it."], ["Your breakthrough is", "*further up the curve*."]],
  bamboo: [["Roots first.", "*Then* growth."], ["Nothing happening?", "Your roots are *growing*."], ["Overnight success", "takes *years* underground."], ["Keep watering it.", "*It's growing.*"], ["What looks like nothing", "is *building something*."], ["Be patient.", "*Year 5* is coming."]],
  domino: [["Don't chase the big domino.", "Push the *small* one."], ["Big changes start", "*embarrassingly small*."], ["One small habit", "can change *everything*."], ["Start with domino one.", "*The rest will follow.*"], ["You don't need a big leap.", "Just *the first push*."], ["Small today.", "*Life-changing* tomorrow."]],
};
const TITLE = {
  pile: (t) => `${t.g}:`,
  squiggle: (t) => `${t.j}:`,
  iceberg: (t) => `What ${t.s} really takes:`,
  compound: (t, k) => pick(["1% better every day:", "The power of tiny habits:", "Small habits, big results:"], k),
  valley: (t) => `${t.g} takes time:`,
  bamboo: (t) => `Why ${t.s} feels slow:`,
  domino: (t) => `${t.j} starts small:`,
};
const WIN = ["Nailed it!", "Got it!", "Finally!", "Made it!", "Yes!!"];
const singular = (u) => u.replace(/s$/, "");

const CAP = {
  pile: (t) => `Expectation: 1 try. Reality: ${fmt(t.c)} ${t.u}. 🎯\n\nEveryone you admire has a pile like this behind them. Keep throwing.`,
  squiggle: (t) => `${t.j}: what people think vs what it really looks like. 〰️\n\n${t.sb.slice(0, 3).join(". ")}. And still: ${t.goal.toLowerCase()}. The loops are part of the line.`,
  iceberg: (t) => `They see "${t.see}". They don't see ${t.hid.slice(0, 3).map((x) => x.toLowerCase()).join(", ")}… 🧊\n\nRespect the part under the water. Especially your own.`,
  compound: (t) => `${t.hab[0]}. That's ${fmt(t.hab[1] * 365)} ${t.hab[1] === 1 ? singular(t.hab[2]) : t.hab[2]} a year. 📈\n\n1.01³⁶⁵ = 37.8. 0.99³⁶⁵ = 0.03. Small choices, compounded.`,
  valley: (t) => `${t.g} doesn't go in a straight line. 📉📈\n\nMost people quit in the valley (${t.quit}). The curve bends for the ones who stay.`,
  bamboo: (t) => `Year 1: ${t.yrs[0]}. Year 4: ${t.yrs[3]}. Year 5: ${t.win.split("\n")[0]} 🎋\n\nNothing looked like it was happening. The roots were growing.`,
  domino: (t) => `${t.dom[0]} → ${t.dom.slice(1, -1).join(" → ")} → ${t.dom[t.dom.length - 1]}. 🁢\n\nYou don't need a big leap. Just push the first domino.`,
};
const TAGS = "#motivation #selfimprovement #growthmindset #discipline #consistency #success #mindset #habits #expectationvsreality #keepgoing";

// length limits so every label fits its drawing
const LIM = { u: 22, goal: 16, sb: 16, see: 17, hid: 22, quit: 26, win: 18, yrs: 22, dom: 20, domLast: 14 };
const warn = [];
const chk = (t, field, v, lim) => { if (v.length > lim) warn.push(`${t.s}.${field}: "${v}" (${v.length} > ${lim})`); };

const posts = [], caps = [];
let n = 0;
for (let r = 0; r < FORMATS.length; r++) {
  TOPICS.forEach((t, ti) => {
    const format = FORMATS[(ti + r) % FORMATS.length];
    const id = String(++n).padStart(3, "0");
    const k = ti + r * 5;
    const p = { id, format, topic: t.s, title: TITLE[format](t, k), music: (n * 5) % 6, accent: (n * 7 + r) % 6, end: pick(END[format], k).map((x) => fill(x, t)) };
    if (format === "pile") p.pile = { unit: t.u, count: t.c, winWord: pick(WIN, k) };
    if (format === "squiggle") p.squiggle = { goal: t.goal, setbacks: t.sb };
    if (format === "iceberg") p.iceberg = { see: t.see, hidden: t.hid };
    if (format === "compound") p.compound = { habit: t.hab[0], perDay: t.hab[1], unit: t.hab[2], unitOne: singular(t.hab[2]) };
    if (format === "valley") p.valley = { quit: t.quit, win: t.win };
    if (format === "bamboo") p.bamboo = { years: t.yrs, win: t.win };
    if (format === "domino") p.domino = { steps: t.dom };
    posts.push(p);
    const tag = "#" + t.s.replace(/[^a-z]/gi, "").toLowerCase();
    caps.push(`## ${id} · ${format} · ${t.s}\n\n${CAP[format](t)}\n\nSave this for the days you want to quit. Tag someone who needs it 👇\n\n${tag} ${TAGS}\n`);
  });
}
for (const t of TOPICS) {
  chk(t, "u", t.u, LIM.u); chk(t, "goal", t.goal, LIM.goal); chk(t, "see", t.see, LIM.see); chk(t, "quit", t.quit, LIM.quit); chk(t, "win", t.win, LIM.win);
  t.sb.forEach((x) => chk(t, "sb", x, LIM.sb)); t.hid.forEach((x) => chk(t, "hid", x, LIM.hid)); t.yrs.forEach((x) => chk(t, "yrs", x, LIM.yrs));
  t.dom.slice(0, -1).forEach((x) => chk(t, "dom", x, LIM.dom)); chk(t, "domLast", t.dom[t.dom.length - 1], LIM.domLast);
  for (const [f, len] of [["sb", 6], ["hid", 6], ["yrs", 4], ["dom", 6]]) if (t[f].length !== len) warn.push(`${t.s}.${f}: needs ${len} items`);
}
writeFileSync(join(ROOT, "content", "posts.json"), JSON.stringify(posts, null, 1));
writeFileSync(join(ROOT, "content", "CAPTIONS.md"), `# Captions: all ${posts.length} posts\n\n` + caps.join("\n"));
console.log(`${TOPICS.length} topics -> ${posts.length} posts`);
if (warn.length) { console.log(`${warn.length} length warnings:\n` + warn.join("\n")); process.exitCode = 1; }
