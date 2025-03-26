import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

serve(async (req) => {
  const url = new URL(req.url);
  const score = parseInt(url.searchParams.get("score") || "0");

  try {
    const id = Math.floor(Math.random() * 151) + 1;
    const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!pokeRes.ok) throw new Error("PokéAPI failed");

    const pokemon = await pokeRes.json();
    const name = capitalize(pokemon.name);
    const sprite = pokemon.sprites.front_default;

    // Easy: Type
    if (score < 3) {
      const types = pokemon.types.map((t: any) => t.type.name).join("/");
      const allTypes = [
        "normal", "fire", "water", "electric", "grass", "ice",
        "fighting", "poison", "ground", "flying", "psychic",
        "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
      ];
      const incorrect = allTypes.filter(t => !types.includes(t)).sort(() => 0.5 - Math.random()).slice(0, 3);
      const choices = [...incorrect, types].sort(() => 0.5 - Math.random());
      return new Response(JSON.stringify({ question: `What type is ${name}?`, choices, answer: types, sprite }), { headers });
    }


// Rare + Hard: Color (only sometimes shown after score ≥ 11)
if (score >= 11 && Math.random() < 0.2) {
  const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
  if (!speciesRes.ok) throw new Error("Species fetch failed");
  const species = await speciesRes.json();
  const color = species.color.name;

  const allColors = ["black", "blue", "brown", "gray", "green", "pink", "purple", "red", "white", "yellow"];
  const incorrect = allColors.filter(c => c !== color).sort(() => 0.5 - Math.random()).slice(0, 3);
  const choices = [...incorrect, color].sort(() => 0.5 - Math.random());

  return new Response(
    JSON.stringify({
      question: `What color is ${capitalize(pokemon.name)}?`,
      choices,
      answer: color
    }),
    { headers }
  );
}


    // Medium: Ability
    if (score < 7) {
      const abilities = pokemon.abilities.map((a: any) => a.ability.name);
      const answer = abilities[0];
      const fallback = ["static", "levitate", "pressure", "overgrow", "torrent", "swarm"];
      const incorrect = fallback.filter(a => !abilities.includes(a)).sort(() => 0.5 - Math.random()).slice(0, 3);
      const choices = [...incorrect, answer].sort(() => 0.5 - Math.random());
      return new Response(JSON.stringify({ question: `Which ability does ${name} have?`, choices, answer, sprite }), { headers });
    }


    // Hard: Base Stat
    if (score < 11) {
      const stat = pokemon.stats.find((s: any) => s.stat.name === "speed").base_stat;
      const answer = stat.toString();
      const incorrect = [stat + 10, stat - 5, stat + 15].map(String);
      const choices = [...incorrect, answer].sort(() => 0.5 - Math.random());
      return new Response(JSON.stringify({ question: `What is ${name}'s base speed stat?`, choices, answer, sprite }), { headers });
    }

// Hard: Random Base Stat Question
if (score >= 9 && score < 13) {
  const statNames = [
    { name: "HP", key: "hp" },
    { name: "Attack", key: "attack" },
    { name: "Defense", key: "defense" },
    { name: "Special Attack", key: "special-attack" },
    { name: "Special Defense", key: "special-defense" },
    { name: "Speed", key: "speed" }
  ];

  const chosen = statNames[Math.floor(Math.random() * statNames.length)];
  const statObj = pokemon.stats.find((s: any) => s.stat.name === chosen.key);
  const stat = statObj?.base_stat ?? 50; // default if missing
  const answer = stat.toString();

  const incorrect = [stat + 10, stat - 5, stat + 15].map(n => n.toString());
  const choices = [...incorrect, answer].sort(() => 0.5 - Math.random());

  return new Response(
    JSON.stringify({
      question: `What is ${capitalize(pokemon.name)}'s base ${chosen.name} stat?`,
      choices,
      answer
    }),
    { headers }
  );
}


    // Ultra Hard: Legendary/Mythical/Baby classification
    if (score >= 13) {
      const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
      if (!speciesRes.ok) throw new Error("Species fetch failed");
      const species = await speciesRes.json();
      let label = "Normal";
      if (species.is_legendary) label = "Legendary";
      else if (species.is_mythical) label = "Mythical";
      else if (species.is_baby) label = "Baby";
      const incorrect = ["Legendary", "Mythical", "Baby", "Normal"].filter(l => l !== label).sort(() => 0.5 - Math.random()).slice(0, 3);
      const choices = [...incorrect, label].sort(() => 0.5 - Math.random());
      return new Response(JSON.stringify({ question: `What kind of species is ${name}?`, choices, answer: label, sprite }), { headers });
    }

    throw new Error("No valid question type found");
  } catch (err) {
    const { data, error } = await supabase.from("fallback_questions").select("*").order("id", { ascending: false }).limit(1).single();
    if (error) {
      return new Response(JSON.stringify({ error: "Fallback failed" }), { headers, status: 500 });
    }
    return new Response(JSON.stringify(data), { headers });
  }
});
