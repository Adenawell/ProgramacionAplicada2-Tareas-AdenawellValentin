module.exports = {
  expo: {
    name: "SistemaReservas",
    slug: "sistema-reservas",
    version: "1.0.0",
    scheme: "sistema-reservas", 
    extra: {
      apiUrl: process.env.API_URL || "https://programacionaplicada2-tareas-rzv9.onrender.com" 
    },
    plugins: [
      "expo-router",
      "expo-status-bar"
    ]
  }
}