function getRandomNumber(min=0, max=100) {
  // Générer un nombre aléatoire entre 0 (inclus) et 1 (exclus)
  const random = Math.random();
  // Multiplier par la différence entre max et min, puis ajouter min pour obtenir un nombre aléatoire entre min (inclus) et max (exclus)
  return Math.floor(random * (max  - min) + min);
}

module.exports = getRandomNumber;