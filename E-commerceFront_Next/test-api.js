// Script de prueba para verificar la conexión con el backend de Medusa
const Medusa = require("@medusajs/js-sdk").default;

const medusa = new Medusa({
  baseUrl: "http://localhost:9000",
  publishableKey: "pk_67272f3624bfdb47a255272d138a8c961e3d42288ebb3e33743371ef9244c922",
});

async function testConnection() {
  console.log("Probando conexion con Medusa backend...\n");
  
  try {
    const { products } = await medusa.store.product.list({
      limit: 5,
    });
    
    console.log("Conexion exitosa!");
    console.log(`Productos encontrados: ${products.length}\n`);
    
    if (products.length > 0) {
      console.log("Primeros productos:");
      products.forEach((product, index) => {
        console.log(`\n${index + 1}. ${product.title}`);
        console.log(`   ID: ${product.id}`);
        console.log(`   Thumbnail: ${product.thumbnail || 'No image'}`);
        if (product.variants && product.variants.length > 0) {
          const price = product.variants[0].prices?.[0]?.amount;
          if (price) {
            console.log(`   Precio: $${price / 100} COP`);
          }
        }
      });
    } else {
      console.log("⚠️  No hay productos en el backend.");
      console.log("   Necesitas agregar productos desde el admin de Medusa.");
    }
  } catch (error) {
    console.error("❌ Error al conectar con el backend:");
    console.error(error.message);
    console.error("\nPosibles causas:");
    console.error("1. El backend no está corriendo en http://localhost:9000");
    console.error("2. La publishable key no es correcta");
    console.error("3. Problemas de CORS");
  }
}

testConnection();
