// services/mediumQuestions.ts

export function generateAbilityQuestion(pokemon: any, name: string, sprite: string) {
    const abilities = pokemon.abilities.map((a: any) => a.ability.name);
    const answer = abilities[0];
    const fallback = ["static", "levitate", "pressure", "overgrow", "torrent", "swarm"];
    const incorrect = fallback.filter(a => !abilities.includes(a)).sort(() => 0.5 - Math.random()).slice(0, 3);
    const choices = [...incorrect, answer].sort(() => 0.5 - Math.random());
  
    return {
      question: `Which ability does ${name} have?`,
      choices,
      answer,
      sprite
    };
  }
  