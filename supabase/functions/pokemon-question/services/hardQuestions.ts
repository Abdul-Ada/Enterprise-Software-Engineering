// services/hardQuestions.ts

// Single stat question (e.g., speed)
export function generateSpeedQuestion(pokemon: any, name: string, sprite: string) {
    const stat = pokemon.stats.find((s: any) => s.stat.name === "speed").base_stat;
    const answer = stat.toString();
    const incorrect = [stat + 10, stat - 5, stat + 15].map(String);
    const choices = [...incorrect, answer].sort(() => 0.5 - Math.random());
  
    return {
      question: `What is ${name}'s base speed stat?`,
      choices,
      answer,
      sprite
    };
  }
  
  // Random stat question (HP, Attack, etc.)
  export function generateRandomStatQuestion(pokemon: any, name: string) {
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
    const stat = statObj?.base_stat ?? 50;
    const answer = stat.toString();
    const incorrect = [stat + 10, stat - 5, stat + 15].map(n => n.toString());
    const choices = [...incorrect, answer].sort(() => 0.5 - Math.random());
  
    return {
      question: `What is ${name}'s base ${chosen.name} stat?`,
      choices,
      answer
    };
  }
  
  // Legendary / Mythical / Baby classification
  export async function generateClassificationQuestion(id: number, name: string, sprite: string) {
    const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    if (!speciesRes.ok) throw new Error("Species fetch failed");
  
    const species = await speciesRes.json();
    let label = "Normal";
    if (species.is_legendary) label = "Legendary";
    else if (species.is_mythical) label = "Mythical";
    else if (species.is_baby) label = "Baby";
  
    const incorrect = ["Legendary", "Mythical", "Baby", "Normal"]
      .filter(l => l !== label)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  
    return {
      question: `What kind of species is ${name}?`,
      choices: [...incorrect, label].sort(() => 0.5 - Math.random()),
      answer: label,
      sprite
    };
  }
  