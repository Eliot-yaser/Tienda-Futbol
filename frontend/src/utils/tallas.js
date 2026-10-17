const tallasPorCategoria = {
  Camisetas: ["S", "M", "L", "XL"],
  Shorts: ["S", "M", "L", "XL"],
  Calzado: ["38", "39", "40", "41", "42", "43", "44", "45"],
  Medias: ["S", "M", "L", "XL"],
  Canilleras: ["S", "M", "L"],
  Guantes: ["7", "8", "9", "10"],
};

export function obtenerTallasPorCategoria(categoria) {
  return tallasPorCategoria[categoria] || [];
}