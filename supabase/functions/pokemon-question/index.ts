import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", // ✅ CORS header added here
};

serve(async () => {
  try {
    const id = Math.floor(Math.random() * 151) + 1;
    const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!pokeRes.ok) throw new Error("PokéAPI failed");

    const pokemon = await pokeRes.json();
    const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const types = pokemon.types.map((t: any) => t.type.name).join("/");
    const question = `What type is ${name}?`;
    const answer = types;

    const allTypes = [
      "normal", "fire", "water", "electric", "grass", "ice",
      "fighting", "poison", "ground", "flying", "psychic",
      "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
    ];

    const incorrect = allTypes
      .filter(t => !types.includes(t))
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const choices = [...incorrect, types].sort(() => 0.5 - Math.random());

    return new Response(
      JSON.stringify({ source: "pokeapi", question, choices, answer }),
      { headers, status: 200 } // ✅ using headers object
    );

  } catch (err) {
    const { data, error } = await supabase
      .from("fallback_questions")
      .select("*")
      .order("id", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch question" }),
        { headers, status: 500 } // ✅ using headers object
      );
    }

    return new Response(
      JSON.stringify({ source: "fallback", ...data }),
      { headers, status: 200 } // ✅ using headers object
    );
  }
});
