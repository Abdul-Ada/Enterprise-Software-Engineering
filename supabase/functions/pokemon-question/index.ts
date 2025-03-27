import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

// ✅ Correct relative imports from index.ts
import { generateTypeQuestion, generateColorQuestion } from "./services/easyQuestions.ts";
import { generateAbilityQuestion } from "./services/mediumQuestions.ts";
import {
  generateSpeedQuestion,
  generateRandomStatQuestion,
  generateClassificationQuestion
} from "./services/hardQuestions.ts";



// Supabase client (uses secure env keys)
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Response headers
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
};

// Cache to reduce PokéAPI usage
const cache = new Map<string, any>();

// Capitalize helper
function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Request handler
serve(async (req) => {
  const url = new URL(req.url);
  const score = parseInt(url.searchParams.get("score") || "0");

  try {
    const id = Math.floor(Math.random() * 151) + 1;
    const cacheKey = `pokemon-${id}`;

    let pokemon;
    if (cache.has(cacheKey)) {
      pokemon = cache.get(cacheKey);
    } else {
      const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      if (!pokeRes.ok) throw new Error("PokéAPI failed");
      pokemon = await pokeRes.json();
      cache.set(cacheKey, pokemon);
    }

    const name = capitalize(pokemon.name);
    const sprite = pokemon.sprites.front_default;

    // Easy: Type question
    if (score < 3) {
      const data = generateTypeQuestion(pokemon, name, sprite);
      return new Response(JSON.stringify(data), { headers });
    }

    // Rare: Color (20% chance if score >= 11)
    if (score >= 11 && Math.random() < 0.2) {
      const data = await generateColorQuestion(id, name);
      return new Response(JSON.stringify(data), { headers });
    }

    // Medium: Ability
    if (score < 7) {
      const data = generateAbilityQuestion(pokemon, name, sprite);
      return new Response(JSON.stringify(data), { headers });
    }

    // Hard: Speed stat
    if (score < 11) {
      const data = generateSpeedQuestion(pokemon, name, sprite);
      return new Response(JSON.stringify(data), { headers });
    }

    // Hard+: Random stat
    if (score >= 9 && score < 13) {
      const data = generateRandomStatQuestion(pokemon, name);
      return new Response(JSON.stringify(data), { headers });
    }

    // Very Hard: Classification
    if (score >= 13) {
      const data = await generateClassificationQuestion(id, name, sprite);
      return new Response(JSON.stringify(data), { headers });
    }

    throw new Error("No valid question type matched");

  } catch (err) {
    console.error("Error:", err.message);

    // Fallback question from Supabase DB
    const { data, error } = await supabase
      .from("fallback_questions")
      .select("*")
      .order("id", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ error: "Fallback failed" }),
        { headers, status: 500 }
      );
    }

    return new Response(JSON.stringify(data), { headers });
  }
});
