// services/easyQuestions.ts

export function generateTypeQuestion(pokemon: any, name: string, sprite: string) {
    const types = pokemon.types.map((t: any) => t.type.name).join("/");
    const allTypes = ["normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground", "flying",
                      "psychic","bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"];
    const incorrect = allTypes.filter(t => !types.includes(t)).sort(() => 0.5 - Math.random()).slice(0, 3);
    const choices = [...incorrect, types].sort(() => 0.5 - Math.random());
  
    return {
      question: `What type is ${name}?`,
      choices,
      answer: types,
      sprite
    };
  }
  
  export async function generateColorQuestion(id: number, name: string) {
    // Rare: if score >= 11 & random < 0.2
    const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    if (!speciesRes.ok) throw new Error("Species fetch failed");
    const species = await speciesRes.json();
    
    const color = species.color.name;
    const allColors = ["black", "blue", "brown", "gray", "green", "pink", "purple", "red", "white", "yellow"];
    const incorrect = allColors.filter(c => c !== color).sort(() => 0.5 - Math.random()).slice(0, 3);
    const choices = [...incorrect, color].sort(() => 0.5 - Math.random());
  
    return {
      question: `What color is ${name}?`,
      choices,
      answer: color
    };
  }
  