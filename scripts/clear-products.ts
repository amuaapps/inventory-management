import { getPayload } from 'payload';
import config from '../src/payload.config';

async function clearProducts() {
  try {
    console.log('Clearing all products...');
    
    const payload = await getPayload({ config });
    
    // Get all products
    const { docs } = await payload.find({
      collection: 'products',
      limit: 1000,
    });
    
    console.log(`Found ${docs.length} products to delete`);
    
    // Delete each product
    for (const product of docs) {
      await payload.delete({
        collection: 'products',
        id: product.id,
      });
      console.log(`✓ Deleted: ${product.name || product.id}`);
    }
    
    console.log('\n✅ All products cleared!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Clear failed:', error);
    process.exit(1);
  }
}

clearProducts();
