import { MongoClient } from 'mongodb';
import { config } from '../src/config';

async function dropProductsCollection() {
  const client = new MongoClient(config.mongodbUri);
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    
    const db = client.db();
    
    console.log('Dropping products collection...');
    await db.collection('products').drop();
    
    console.log('✅ Products collection dropped successfully!');
  } catch (error: any) {
    if (error.message.includes('ns not found')) {
      console.log('✅ Products collection does not exist (already clean)');
    } else {
      console.error('❌ Error:', error.message);
    }
  } finally {
    await client.close();
    process.exit(0);
  }
}

dropProductsCollection();
