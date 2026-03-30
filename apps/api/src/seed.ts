import db from "./db/connection.js";
import { initSchema } from "./db/schema.js";
import bcrypt from "bcryptjs";

// Reset tables
db.exec(`
  DROP TABLE IF EXISTS highlights;
  DROP TABLE IF EXISTS reading_progress;
  DROP TABLE IF EXISTS chapters;
  DROP TABLE IF EXISTS books;
  DROP TABLE IF EXISTS users;
`);

initSchema();

// --- Users ---
const hashSync = bcrypt.hashSync;
const insertUser = db.prepare(
  `INSERT INTO users (id, name, email, password_hash, subscription) VALUES (?, ?, ?, ?, ?)`
);
insertUser.run("user-free-001", "Ana García", "free@example.com", hashSync("free123", 10), "free");
insertUser.run("user-premium-001", "Johan Castellanos", "premium@example.com", hashSync("premium123", 10), "premium");

// --- Books ---
const insertBook = db.prepare(
  `INSERT INTO books (id, title, slug, description, cover_image) VALUES (?, ?, ?, ?, ?)`
);
insertBook.run(
  "book-famine",
  "The Great Famine 2026",
  "the-great-famine",
  "Discover a gripping historical novel set against the backdrop of a nation in crisis. Follow the lives of ordinary people as they navigate extraordinary challenges, resilience, and the enduring human spirit.",
  "/images/hero.png"
);
insertBook.run(
  "book-clay-iron",
  "Clay and Iron 2027",
  "clay-and-iron",
  "A prophetic exploration of the vision in Daniel 2 — the great statue of kingdoms from Babylon to the end times. Understand how the mixing of iron and clay reveals the fragile alliances of our modern world.",
  "/images/hero.png"
);

// --- Chapters ---
const insertChapter = db.prepare(
  `INSERT INTO chapters (id, book_id, number, title, content, is_free) VALUES (?, ?, ?, ?, ?, ?)`
);

// The Great Famine chapters
const famineChapters = [
  {
    id: "ch-famine-1",
    title: "The Harvest's End",
    isFree: 1,
    content: `The autumn of 2025 came with an unsettling stillness. Across the heartlands of Europe and the American Midwest, the fields that had once waved golden with wheat and barley now stood parched and brittle. The soil, overworked for decades, had finally begun to give way.

Farmers like Elías Rodríguez in southern Spain noticed it first. The rains that should have come in September never arrived. By October, the reservoirs were at historic lows, and the government issued its first water rationing orders. But Elías knew this was different from the droughts of years past. The earth itself felt exhausted, as though it had decided to stop producing.

In the United States, the situation mirrored what was happening across the Atlantic. The great aquifers of the plains states, drawn upon for generations, showed alarming depletion rates. Satellite imagery revealed vast stretches of farmland turning from green to brown in a matter of weeks. The harvest of 2025 would be remembered as the last normal harvest — though at the time, no one knew just how precious those final yields would become.

The global commodity markets reacted swiftly. Wheat futures surged to unprecedented levels, and nations began quietly stockpiling grain reserves. Behind closed doors, intelligence agencies briefed world leaders on what agricultural scientists had been warning about for years: the convergence of soil degradation, water scarcity, and climate disruption was no longer a future threat. It was here.`,
  },
  {
    id: "ch-famine-2",
    title: "The Empty Promise",
    isFree: 1,
    content: `By January 2026, the word "shortage" had entered everyday vocabulary. Supermarket shelves that once overflowed with bread, pasta, and cereals began to show gaps. Governments issued reassurances — supply chain adjustments, they called it. Temporary disruptions. Nothing to worry about.

But behind the calm press conferences, emergency meetings told a different story. The United Nations Food and Agriculture Organization convened a special session in Geneva, where delegates from 140 nations heard a sobering report: global grain production had fallen 34% from the previous year, the sharpest decline in modern history.

Maria Chen, a logistics manager at a major food distribution company in Chicago, watched the numbers with growing alarm. Orders from retail chains had doubled, but her warehouses were emptying faster than they could be restocked. She began to notice something else: the prices her company paid to suppliers were climbing by the week, sometimes by the day.

The promises of politicians rang hollow. "We have ample reserves," said one agriculture minister on national television, even as internal documents showed those reserves would last no more than eight weeks at current consumption rates. The gap between public optimism and private panic widened with each passing day.

Across social media, whispers turned to shouts. Videos of empty shelves went viral. Conspiracy theories flourished alongside genuine concern. And in the quiet corners of the world — in the villages of sub-Saharan Africa, the rural towns of Southeast Asia, the forgotten communities of Central America — the famine had already begun, unnoticed by the cameras that would only arrive months later.`,
  },
  {
    id: "ch-famine-3",
    title: "The First Winter",
    isFree: 0,
    content: `The winter of 2026 descended upon the Northern Hemisphere with a ferocity that seemed almost personal. Temperatures plunged to levels not seen in decades, and the energy grids — already strained by the transition away from fossil fuels — buckled under the demand.

In Berlin, rolling blackouts became the norm. Families huddled in living rooms lit by candles, rationing the food they had managed to stockpile. The German government, once a beacon of efficiency, scrambled to coordinate with neighboring nations for emergency grain shipments that never seemed to arrive in sufficient quantities.

The roads became rivers of humanity, ragged families carrying their few possessions, trudging towards the relief centers or the cities where they hoped to find food. The air was thick with the scent of wood smoke and desperation, a constant reminder of the catastrophe that had overtaken the world.

Elena Volkov, a 67-year-old retired teacher in Moscow, remembered the stories her grandmother had told about the siege of Leningrad. She never imagined those stories would feel so relevant. Her pension, once modest but sufficient, now barely covered a week's worth of bread. She began to trade her late husband's books for potatoes.

In the American South, churches opened their doors as makeshift shelters and food banks. Pastor James Wright of a small Baptist church in rural Alabama found himself feeding three hundred people a day with supplies meant for thirty. "I've read about famine in the Bible my whole life," he told a reporter. "I never thought I'd see it with my own eyes in America."

Despite the efforts of relief committees and international organizations, hunger gnawed at every soul, and the specter of death was never far. The first winter of the Great Famine would claim over two million lives worldwide — a number that, at the time, seemed unimaginable but would later be dwarfed by what was to come.`,
  },
  {
    id: "ch-famine-4",
    title: "A Desperate Journey",
    isFree: 0,
    content: `Spring 2026 brought no relief. The rains that farmers prayed for came too late and too little. Fields that should have been planted remained fallow — there were no seeds to plant, or no fuel to run the machinery, or no workers who hadn't fled to the cities in search of food.

The migration patterns that had begun in the winter accelerated into a full-blown exodus. In Central America, caravans of thousands moved northward, not driven by dreams of prosperity but by the simple imperative of survival. Similar movements rippled across Africa, the Middle East, and South Asia. The world had never seen displacement on this scale.

Among the millions was Sofia Herrera, a schoolteacher from Honduras who set out with her two children and her elderly mother. They joined a caravan of over five thousand people, walking north through Guatemala and Mexico. Sofia carried a small backpack with family photos, her children's birth certificates, and three days' worth of tortillas. She had no plan beyond the next step.

The journey was brutal. Heat by day, cold by night. Disease spread through the cramped camps where travelers rested. At border crossings, they encountered walls both literal and bureaucratic. Nations that had once championed human rights now turned desperate people away, citing their own domestic crises.

Yet amid the suffering, acts of extraordinary kindness emerged. A Mexican farmer who had lost his own crop opened his land to a group of travelers, letting them rest and sharing his family's last stores of corn. A doctor from Guatemala City abandoned her practice to travel with the caravan, treating the sick and injured with whatever supplies she could gather.

These stories of compassion, though overshadowed by the scale of the catastrophe, would later be remembered as proof that even in humanity's darkest hours, the light of human decency refused to be extinguished entirely.`,
  },
  {
    id: "ch-famine-5",
    title: "Hope in the Distance",
    isFree: 0,
    content: `By late 2026, the world stood at a crossroads. The famine had exposed every fault line in the global system — the fragility of supply chains, the illusion of endless abundance, the failure of institutions built for a world that no longer existed.

But it had also revealed something else: the extraordinary resilience of ordinary people and the power of community in the face of catastrophe.

In Detroit, an abandoned automobile factory had been transformed into the largest urban farm in North America. Thousands of volunteers — former autoworkers, students, retirees, refugees — worked together to grow food using hydroponics and vertical farming techniques. The project, born of desperation, became a model that would be replicated in cities around the world.

In Kenya, a network of small-scale farmers developed drought-resistant crop varieties through traditional knowledge combined with modern science. Their seeds, shared freely across borders, would eventually help restore food production in regions that had been written off as permanently damaged.

And in the halls of power, a new generation of leaders began to emerge — leaders who understood that the old ways had failed and that a different approach was needed. The international community, chastened by its slow response to the crisis, began to build new institutions focused on food security, sustainable agriculture, and equitable distribution.

For those who had lived through the worst of it — the hunger, the loss, the desperate journeys — hope was not a naive sentiment but a hard-won conviction. They had seen the worst of what humans could do, and also the best. They knew that the road ahead would be long and difficult. But they also knew, with a certainty born of experience, that the dawn always follows the darkest night.

The Great Famine of 2026 would be remembered not only for its devastation but for the transformation it catalyzed — a transformation that, as the prophets had foretold, was merely the beginning of a much larger story yet to unfold.`,
  },
];

for (const ch of famineChapters) {
  insertChapter.run(ch.id, "book-famine", famineChapters.indexOf(ch) + 1, ch.title, ch.content, ch.isFree);
}

// Clay and Iron chapters
const clayChapters = [
  {
    id: "ch-clay-1",
    title: "The Vision of the Statue",
    isFree: 1,
    content: `In the second year of his reign, Nebuchadnezzar had dreams that troubled his spirit and robbed him of sleep. The most powerful man in the known world, ruler of the Neo-Babylonian Empire, found himself haunted by a vision he could neither understand nor forget.

He summoned his magicians, enchanters, sorcerers, and astrologers — the intellectual elite of Babylon — and demanded not only an interpretation but the dream itself. When they protested that no king had ever made such a demand, Nebuchadnezzar threatened them all with death. It was in this moment of crisis that Daniel, a young Hebrew exile, stepped forward.

What Daniel revealed changed the course of prophetic understanding forever. He described a great statue, terrifying in its brilliance: a head of pure gold, chest and arms of silver, belly and thighs of bronze, legs of iron, and feet of mixed iron and clay. Then a stone, cut out without human hands, struck the statue on its feet and shattered the entire image to pieces.

This vision, recorded in Daniel chapter 2, has been studied by scholars, theologians, and historians for over two thousand years. It represents nothing less than a divine roadmap of human history — from Babylon to the end of human government and the establishment of God's eternal kingdom.

What makes this prophecy remarkable is not only its scope but its accuracy. As we trace the succession of empires through history — Babylon, Medo-Persia, Greece, and Rome — we find that each transition happened exactly as the vision described. The metals decrease in value but increase in strength, mirroring the nature of each empire.

But it is the feet of the statue — that strange mixture of iron and clay — that concerns us most directly. For if the historical empires correspond to the metals above, then the iron and clay represent the world system of our own time. And understanding what this mixture means may be the key to understanding everything that is happening around us today.`,
  },
  {
    id: "ch-clay-2",
    title: "Kingdoms of Earth",
    isFree: 1,
    content: `To understand where we are going, we must first understand where we have been. The succession of empires described in Nebuchadnezzar's dream reads like a textbook of ancient and medieval history — with one crucial difference: it was written centuries before many of these empires existed.

The head of gold was Babylon itself, and Daniel said as much to Nebuchadnezzar: "You are that head of gold." Babylon under Nebuchadnezzar represented the pinnacle of concentrated power — a single monarch with absolute authority over a vast empire. The gold symbolized not only wealth but the unified nature of Babylonian rule.

The chest and arms of silver represented the Medo-Persian Empire, which conquered Babylon in 539 BC. The two arms perfectly symbolized the dual nature of this kingdom — a coalition of the Medes and the Persians. Though vast in territory, surpassing even Babylon, the Medo-Persian system was inherently less unified, requiring a complex bureaucracy of satraps and governors.

The belly and thighs of bronze pointed to the Greek Empire of Alexander the Great, who swept across the known world with unprecedented speed. Bronze, stronger than silver, reflected the military superiority of the Greek phalanx. Alexander's empire stretched from Greece to India, but upon his death it fractured into four kingdoms — a division hinted at by the dual nature of the thighs.

Then came the legs of iron — Rome. No metal in the ancient world was stronger than iron, and no empire in antiquity was more powerful than Rome. For centuries, Rome dominated the Mediterranean world and beyond, crushing all opposition with its legendary legions. The two legs corresponded to the eventual division of the Roman Empire into its Western and Eastern halves.

Each empire was larger, stronger, and more complex than the last — yet each was also less unified, less pure in its concentration of power. This pattern was not accidental. It was by design, building toward the most enigmatic part of the statue: the feet where iron meets clay.`,
  },
  {
    id: "ch-clay-3",
    title: "The Mixing of Seeds",
    isFree: 0,
    content: `The prophet Daniel provided a cryptic but revealing detail about the feet of the statue: "As you saw iron mixed with ceramic clay, they will mingle with the seed of men; but they will not adhere to one another, just as iron does not mix with clay."

This phrase — "they will mingle with the seed of men" — has puzzled interpreters for centuries. Who are "they"? What does it mean to mingle with the seed of men while remaining fundamentally separate?

The iron, as we have established, represents the legacy of Rome — the system of governance, law, and military organization that has shaped Western civilization. The fragments of the Roman Empire did not disappear; they evolved into the nation-states of Europe and, through colonization, spread their systems across the globe. The iron is still with us.

But the clay represents something different — something that weakens the iron from within. Clay in Biblical symbolism often represents humanity in its natural, created state. It is the material from which God formed Adam. It is fragile, moldable, and fundamentally incompatible with the rigidity of iron.

Consider the geopolitical landscape of our modern world. We see powerful institutions — military alliances, economic unions, international organizations — that appear strong on the surface. NATO, the European Union, the United Nations, global trade agreements. These are structures of iron, inherited from centuries of Western power.

Yet within these structures, the forces of fragmentation grow stronger every year. National interests clash with international cooperation. Populist movements challenge established orders. Economic inequality creates fissures that no amount of political rhetoric can seal. Alliances that once seemed unbreakable show cracks under the pressure of competing interests.

This is the iron and clay of our age: a world system that appears powerful and unified but is fundamentally divided, held together by agreements and treaties that can fracture at any moment. The iron and clay do not mix. They never will.

The implications of this prophetic reality are profound. It means that every attempt to create a lasting global order — every empire, every alliance, every "new world order" — is destined to fail. Not because of poor leadership or bad policy, but because the very nature of the age we live in is one of inherent instability.`,
  },
  {
    id: "ch-clay-4",
    title: "The Stone Uncut by Hands",
    isFree: 0,
    content: `The climax of Nebuchadnezzar's dream was not the statue itself but what happened to it. A stone was cut out of a mountain — not by human hands — and it struck the statue on its feet of iron and clay. The impact was catastrophic. The entire statue — gold, silver, bronze, iron, and clay — shattered into pieces "like chaff on a summer threshing floor," and the wind carried them away until no trace of them was found.

Then the stone that struck the statue became a great mountain that filled the whole earth.

This stone represents the Kingdom of God — a kingdom established not by human effort, not by political revolution, not by military conquest, but by divine intervention. It is, in the words of Daniel, a kingdom that "shall never be destroyed" and that "shall stand forever."

The striking detail is the target of the stone's impact: the feet. Not the head, not the chest, not the legs — the feet. This tells us something crucial about the timing of God's intervention. The stone strikes during the era of the iron and clay — during our era. The kingdom of God does not arrive at the beginning of human history or in the middle. It arrives at the end, when the final form of human government has reached its ultimate expression of divided strength and weakness.

Throughout history, well-meaning believers have tried to establish God's kingdom through human means — through political power, military crusades, social movements, and institutional religion. All of these efforts, however noble in intention, fundamentally misunderstand the nature of the stone. It is cut "without hands." It operates outside and above human systems.

This does not mean that believers should be passive or disengaged from the world. Far from it. But it does mean that our ultimate hope is not in political parties, economic systems, or human institutions. Our hope is in the stone that will one day shatter every human kingdom and establish a rule of justice, peace, and righteousness that will never end.

The question for each of us is not whether this will happen — Daniel assures us it will — but whether we are prepared when it does.`,
  },
  {
    id: "ch-clay-5",
    title: "The Eternal Kingdom",
    isFree: 0,
    content: `The final image of Nebuchadnezzar's dream is breathtaking in its simplicity and scope: the stone becomes a great mountain that fills the whole earth. Where once there stood a towering statue representing millennia of human power, now there is only the mountain — solid, eternal, unshakeable.

Daniel interpreted this for the king: "In the days of those kings, the God of heaven will set up a kingdom that shall never be destroyed, nor shall the kingdom be left to another people. It shall break in pieces and consume all these kingdoms, and it shall stand forever."

What does this eternal kingdom look like? Throughout Scripture, we are given glimpses. Isaiah speaks of a time when "the wolf shall dwell with the lamb," when "they shall not hurt or destroy in all my holy mountain." The psalmist declares that the Messiah will rule "from sea to sea, and from the river to the ends of the earth." Revelation describes a new heaven and a new earth, where God dwells with His people and "there shall be no more death, neither sorrow, nor crying."

These are not metaphors or spiritual abstractions. They describe a real, physical, political reality — a kingdom with a King, subjects, laws, territory, and purpose. The 1000-year reign of Jesus Christ, described in Revelation 20, is the initial phase of this eternal kingdom. It is the restoration of what was lost in Eden and the fulfillment of every promise God has made to His people since Abraham.

For those living in the age of iron and clay — our age — this vision is both a warning and a promise. A warning, because the systems we depend on are temporary and fragile. A promise, because what is coming is infinitely better than anything humanity has ever built.

The Great Famine, the geopolitical upheavals, the social fragmentation, the technological disruptions — all of these are birth pains, signs that the old order is passing away. They are not the end of the story. They are the prelude to a new beginning.

As we watch the feet of iron and clay crumble, let us lift our eyes to the mountain that is coming. Let us prepare ourselves — spiritually, intellectually, and practically — for the transition from the age of human kingdoms to the age of God's eternal reign. The stone has been cut. It is already in motion. And nothing in heaven or on earth can stop it.`,
  },
];

for (const ch of clayChapters) {
  insertChapter.run(ch.id, "book-clay-iron", clayChapters.indexOf(ch) + 1, ch.title, ch.content, ch.isFree);
}

// --- Reading Progress (sample) ---
const insertProgress = db.prepare(
  `INSERT INTO reading_progress (user_id, book_id, current_chapter, progress_percent) VALUES (?, ?, ?, ?)`
);
insertProgress.run("user-premium-001", "book-famine", 3, 45);
insertProgress.run("user-premium-001", "book-clay-iron", 1, 10);
insertProgress.run("user-free-001", "book-famine", 2, 30);

console.log("Seed complete:");
console.log("  2 users (free@example.com / free123, premium@example.com / premium123)");
console.log("  2 books (5 chapters each, chapters 1-2 free)");
console.log("  3 reading progress entries");
