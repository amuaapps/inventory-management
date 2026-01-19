import { getPayload } from 'payload';
import config from '../src/payload.config';

const products = [
  {
    productId: '3f6a2c7e-9c2a-4d1b-8e1f-6c1a4e2b9d34',
    name: 'Gift to Commit',
    productLine: 'protect',
    productType: 'addon',
    fundsRaised: 36940000, // $369,400 in cents
    fundsNeeded: 44320000, // $443,200 in cents
    description: 'Support community commitment initiatives',
    tags: [{ tag: 'Child & Community' }],
    isActive: true,
  },
  {
    productId: 'b8a7f1d2-6e4b-4f2c-9a31-0e5c8d4f6a12',
    name: 'Kids Corner',
    productLine: 'protect',
    productType: 'addon',
    fundsRaised: 2395500, // $23,955 in cents
    fundsNeeded: 2874600, // $28,746 in cents
    description: 'Create safe spaces for children',
    tags: [{ tag: 'Child & Community' }],
    isActive: true,
  },
  {
    productId: '1d9e4a72-8c3f-4a6e-bd21-5f0c7a3e9b64',
    name: 'Uniforms and',
    productLine: 'protect',
    productType: 'addon',
    fundsRaised: 1533000, // $15,330 in cents
    fundsNeeded: 1839600, // $18,396 in cents
    description: 'Provide school uniforms for children',
    tags: [{ tag: 'Child & Community' }],
    isActive: true,
  },
  {
    productId: 'a4c7b6e2-5f91-4a3d-8c2e-1d9f0b6e3a57',
    name: 'Help Speak',
    productLine: 'protect',
    productType: 'addon',
    fundsRaised: 4525000, // $45,250 in cents
    fundsNeeded: 5430000, // $54,300 in cents
    description: 'Support child advocacy programs',
    tags: [{ tag: 'Child Protection' }],
    isActive: true,
  },
  {
    productId: '9f2e6a1b-4c5d-4b3a-9e87-0d6c1f5a2b34',
    name: 'Women and G',
    productLine: 'empower',
    productType: 'activation',
    fundsRaised: 8447000, // $84,470 in cents
    fundsNeeded: 10136400, // $101,364 in cents
    description: 'Empower women and girls through education',
    tags: [{ tag: 'Child Protection' }],
    isActive: true,
  },
  {
    productId: '6c3f5b9e-8a7d-4e12-b4a1-2f0c9d6e5a38',
    name: 'Green Energy',
    productLine: 'equip',
    productType: 'addon',
    fundsRaised: 11000000, // $110,000 in cents
    fundsNeeded: 13200000, // $132,000 in cents
    description: 'Renewable energy solutions for communities',
    tags: [{ tag: 'Climate, Child & Community' }],
    isActive: true,
  },
  {
    productId: 'e5b7a0f6-9c4d-4a2e-8b31-6d1c3f2a9874',
    name: 'Solar Panels',
    productLine: 'equip',
    productType: 'addon',
    fundsRaised: 1473000, // $14,730 in cents
    fundsNeeded: 1767600, // $17,676 in cents
    description: 'Install solar panels for sustainable energy',
    tags: [{ tag: 'Climate, Child & Community' }],
    isActive: true,
  },
  {
    productId: '0c9b6e5a-2d4f-4f1a-9e87-3b7d1c8a6542',
    name: 'Education Fur',
    productLine: 'protect',
    productType: 'addon',
    fundsRaised: 8121000, // $81,210 in cents
    fundsNeeded: 9745200, // $97,452 in cents
    description: 'Provide furniture for educational facilities',
    tags: [{ tag: 'Education' }],
    isActive: true,
  },
  {
    productId: '7a6d9c3e-5f4b-4b8a-a2e1-0c1f9d654b72',
    name: 'Tools for Chil',
    productLine: 'protect',
    productType: 'addon',
    fundsRaised: 3549000, // $35,490 in cents
    fundsNeeded: 4258800, // $42,588 in cents
    description: 'Educational tools and supplies for children',
    tags: [{ tag: 'Education' }],
    isActive: true,
  },
  {
    productId: 'f1a9c2e7-3b6d-4e8a-9f54-6c0b5d1a2473',
    name: 'Nutritious Sch',
    productLine: 'respond',
    productType: 'addon',
    fundsRaised: 15165900, // $151,659 in cents
    fundsNeeded: 18199080, // $181,990.8 in cents
    description: 'Nutritious school meal programs',
    tags: [{ tag: 'Education' }],
    isActive: true,
  },
  {
    productId: '2b5f1d6c-9a3e-4c87-8e40-a7d9b6f13254',
    name: 'Books for Bright',
    productLine: 'protect',
    productType: 'addon',
    fundsRaised: 4176000, // $41,760 in cents
    fundsNeeded: 5011200, // $50,112 in cents
    description: 'Books and reading materials for students',
    tags: [{ tag: 'Education' }],
    isActive: true,
  },
  {
    productId: '8e1b2c9f-5d6a-4f34-b7a0-3c5e1d924687',
    name: 'Vocational Tra',
    productLine: 'equip',
    productType: 'addon',
    fundsRaised: 6069000, // $60,690 in cents
    fundsNeeded: 7282800, // $72,828 in cents
    description: 'Vocational training programs',
    tags: [{ tag: 'Education' }],
    isActive: true,
  },
  {
    productId: '5d9f7c4a-3e2b-4b61-8a0c-1e6f925d3478',
    name: 'Emerg Relief N',
    productLine: 'protect',
    productType: 'addon',
    fundsRaised: 48465900, // $484,659 in cents
    fundsNeeded: 58159080, // $581,590.8 in cents
    description: 'Emergency relief supplies',
    tags: [{ tag: 'ELITE' }],
    isActive: true,
  },
  {
    productId: 'a7e3c2f9-8d5b-4a61-9c0f-4e1b6d253874',
    name: 'Emergency Fo',
    productLine: 'respond',
    productType: 'activation',
    fundsRaised: 20900400, // $209,004 in cents
    fundsNeeded: 25080480, // $250,804.8 in cents
    description: 'Emergency food distribution',
    tags: [{ tag: 'Emergency & Survival' }],
    isActive: true,
  },
  {
    productId: '1b8a4c7d-2f6e-4d9a-8c53-0e5f9b6a2134',
    name: 'Cash and You',
    productLine: 'respond',
    productType: 'addon',
    fundsRaised: 3530000, // $35,300 in cents
    fundsNeeded: 4236000, // $42,360 in cents
    description: 'Cash assistance programs',
    tags: [{ tag: 'Emergency & Survival' }],
    isActive: true,
  },
  {
    productId: '6f2c9e5a-7b8d-4a13-9e0c-d1b4f365a872',
    name: 'Help Save the',
    productLine: 'respond',
    productType: 'addon',
    fundsRaised: 1238000, // $12,380 in cents
    fundsNeeded: 1485600, // $14,856 in cents
    description: 'Life-saving emergency interventions',
    tags: [{ tag: 'Emergency & Survival' }],
    isActive: true,
  },
  {
    productId: '9a1c8b5e-6f2d-4e34-b7a9-3c0d4f658712',
    name: 'Community G',
    productLine: 'equip',
    productType: 'addon',
    fundsRaised: 1818000, // $18,180 in cents
    fundsNeeded: 2181600, // $21,816 in cents
    description: 'Community garden initiatives',
    tags: [{ tag: 'Farming' }],
    isActive: true,
  },
  {
    productId: 'c3f4b5a9-7e6d-4a28-8b10-2e9f1d654c37',
    name: 'Agriculture',
    productLine: 'equip',
    productType: 'activation',
    fundsRaised: 12384500, // $123,845 in cents
    fundsNeeded: 14861400, // $148,614 in cents
    description: 'Agricultural development programs',
    tags: [{ tag: 'Farming' }],
    isActive: true,
  },
  {
    productId: '2a5e7d9f-4c3b-4b18-9a6e-f1c0d8547326',
    name: 'Mental Health',
    productLine: 'equip',
    productType: 'addon',
    fundsRaised: 2051100, // $20,511 in cents
    fundsNeeded: 2461320, // $24,613.2 in cents
    description: 'Mental health support services',
    tags: [{ tag: 'Health' }],
    isActive: true,
  },
  {
    productId: 'b6d3e2f9-7a1c-4c58-8e40-5f9a1d2b6374',
    name: 'Food for Child',
    productLine: 'equip',
    productType: 'addon',
    fundsRaised: 4358500, // $43,585 in cents
    fundsNeeded: 5230200, // $52,302 in cents
    description: 'Nutritious food for children',
    tags: [{ tag: 'Health & Nutrition' }],
    isActive: true,
  },
  {
    productId: '7f4e1a6b-9d8c-4b25-a3e0-2c5f9d617834',
    name: 'Feed Hungry F',
    productLine: 'respond',
    productType: 'activation',
    fundsRaised: 27593100, // $275,931 in cents
    fundsNeeded: 33111720, // $331,117.2 in cents
    description: 'Feed hungry families program',
    tags: [{ tag: 'Health & Nutrition' }],
    isActive: true,
  },
  {
    productId: '4d6a5b1f-2e9c-4a87-8f30-c7e1d9b53264',
    name: 'Family Essent',
    productLine: 'equip',
    productType: 'addon',
    fundsRaised: 2963500, // $29,635 in cents
    fundsNeeded: 3560200, // $35,602 in cents
    description: 'Essential supplies for families',
    tags: [{ tag: 'Health & Nutrition' }],
    isActive: true,
  },
  {
    productId: 'e8c9b1a6-4f3d-4a52-9e70-5d2f7b1634ac',
    name: 'Family Comm',
    productLine: 'respond',
    productType: 'activation',
    fundsRaised: 32268400, // $322,684 in cents
    fundsNeeded: 38722080, // $387,220.8 in cents
    description: 'Family community support programs',
    tags: [{ tag: 'Health & Nutrition' }],
    isActive: true,
  },
  {
    productId: '3b7f9e5d-6a4c-4e12-b8a1-2d0f9c654731',
    name: 'Stock Medicin',
    productLine: 'equip',
    productType: 'addon',
    fundsRaised: 6940000, // $69,400 in cents
    fundsNeeded: 8328000, // $83,280 in cents
    description: 'Medical supplies and medications',
    tags: [{ tag: 'Health & Nutrition' }],
    isActive: true,
  },
  {
    productId: '5a1c2e9b-7f4d-4b86-8d30-6e9f3c154a72',
    name: 'Hens and Chic',
    productLine: 'equip',
    productType: 'addon',
    fundsRaised: 25901000, // $259,010 in cents
    fundsNeeded: 31081200, // $310,812 in cents
    description: 'Poultry farming starter kits',
    tags: [{ tag: 'Livestock' }],
    isActive: true,
  },
  {
    productId: '9e4b7c3f-1a6d-4a28-b5c9-0f2d815e3467',
    name: 'Goats',
    productLine: 'equip',
    productType: 'addon',
    fundsRaised: 24813600, // $248,136 in cents
    fundsNeeded: 29776320, // $297,763.2 in cents
    description: 'Goat farming for sustainable income',
    tags: [{ tag: 'Livestock' }],
    isActive: true,
  },
  {
    productId: 'd7c8f2a5-9b6e-4e31-8a04-1f3d9c654b72',
    name: 'Piglets',
    productLine: 'equip',
    productType: 'addon',
    fundsRaised: 1789500, // $17,895 in cents
    fundsNeeded: 2147400, // $21,474 in cents
    description: 'Pig farming starter program',
    tags: [{ tag: 'Livestock' }],
    isActive: true,
  },
  {
    productId: '0b5e6c7a-4d9f-4a21-8e3c-1f2d9b865734',
    name: 'Beehives/Beek',
    productLine: 'equip',
    productType: 'addon',
    fundsRaised: 2955500, // $29,555 in cents
    fundsNeeded: 3546600, // $35,466 in cents
    description: 'Beekeeping equipment and training',
    tags: [{ tag: 'Livestock' }],
    isActive: true,
  },
  {
    productId: 'a3d6e7b1-9f4c-4b58-8a20-5c2f1d9e6374',
    name: 'Goats, Hens a',
    productLine: 'equip',
    productType: 'addon',
    fundsRaised: 30789200, // $307,892 in cents
    fundsNeeded: 36947040, // $369,470.4 in cents
    description: 'Combined livestock farming package',
    tags: [{ tag: 'Livestock' }],
    isActive: true,
  },
  {
    productId: '6b5f3d9a-7e4c-4a12-8c01-e2d1f9b65437',
    name: 'Help Fill a',
    productLine: 'equip',
    productType: 'addon',
    fundsRaised: 7715000, // $77,150 in cents
    fundsNeeded: 9258000, // $92,580 in cents
    description: 'Fill water storage facilities',
    tags: [{ tag: 'Livestock' }],
    isActive: true,
  },
  {
    productId: 'c9e4f2a7-6d3b-4b18-8a05-1d5f963742bc',
    name: 'Help Build Lat',
    productLine: 'equip',
    productType: 'addon',
    fundsRaised: 1847500, // $18,475 in cents
    fundsNeeded: 2217000, // $22,170 in cents
    description: 'Build latrines for sanitation',
    tags: [{ tag: 'Water' }],
    isActive: true,
  },
  {
    productId: '8a6b1c5f-4d3e-4f92-9e70-2d7c9b543a61',
    name: 'Clean Water Fi',
    productLine: 'equip',
    productType: 'addon',
    fundsRaised: 10218600, // $102,186 in cents
    fundsNeeded: 12262320, // $122,623.2 in cents
    description: 'Clean water filtration systems',
    tags: [{ tag: 'Water' }],
    isActive: true,
  },
  {
    productId: '1f7b6d4e-9a2c-4a85-8c30-5e9b3d612f74',
    name: 'Help Build a W',
    productLine: 'equip',
    productType: 'addon',
    fundsRaised: 10760000, // $107,600 in cents
    fundsNeeded: 12936000, // $129,360 in cents
    description: 'Build water wells for communities',
    tags: [{ tag: 'Water' }],
    isActive: true,
  },
  {
    productId: '4c5e9a1b-6d7f-4b32-8a0e-f2d3c9657418',
    name: 'Clean Water',
    productLine: 'protect',
    productType: 'addon',
    fundsRaised: 16153000, // $161,530 in cents
    fundsNeeded: 19383600, // $193,836 in cents
    description: 'Clean water access initiatives',
    tags: [{ tag: 'Water' }],
    isActive: true,
  },
  {
    productId: 'f5b9c2d6-1e7a-4a83-9c40-3d8e7b654a21',
    name: 'Send Girls to S',
    productLine: 'empower',
    productType: 'addon',
    fundsRaised: 1840000, // $18,400 in cents
    fundsNeeded: 2208000, // $22,080 in cents
    description: 'Send girls to school program',
    tags: [{ tag: 'Women & Girls' }],
    isActive: true,
  },
  {
    productId: '7d3f6a5c-2b9e-4e14-8a90-1c4f9d856b72',
    name: 'Mom and Baby',
    productLine: 'protect',
    productType: 'addon',
    fundsRaised: 29177800, // $291,778 in cents
    fundsNeeded: 35013360, // $350,133.6 in cents
    description: 'Maternal and infant health care',
    tags: [{ tag: 'Women & Girls' }],
    isActive: true,
  },
  {
    productId: '2e9a7c5d-8f6b-4b31-9a04-d1c3f6547e28',
    name: 'Empower Wom',
    productLine: 'empower',
    productType: 'addon',
    fundsRaised: 3459300, // $34,593 in cents
    fundsNeeded: 4151160, // $41,511.6 in cents
    description: 'Women empowerment programs',
    tags: [{ tag: 'Women & Girls' }],
    isActive: true,
  },
  {
    productId: '9c6a5f7b-3d2e-4a81-8b04-1f4dce527639',
    name: 'Girls Hygiene I',
    productLine: 'empower',
    productType: 'addon',
    fundsRaised: 7588000, // $75,880 in cents
    fundsNeeded: 9105600, // $91,056 in cents
    description: 'Hygiene kits and education for girls',
    tags: [{ tag: 'Women & Girls' }],
    isActive: true,
  },
  {
    productId: 'b3e7d9a2-6c1f-4b58-9a04-5f8c1d674e32',
    name: 'Empower Wom',
    productLine: 'empower',
    productType: 'addon',
    fundsRaised: 16323100, // $163,231 in cents
    fundsNeeded: 19587720, // $195,877.2 in cents
    description: 'Women economic empowerment initiative',
    tags: [{ tag: 'Women & Girls' }],
    isActive: true,
  },
];

async function seedProducts() {
  try {
    console.log('Starting product seed...');
    
    const payload = await getPayload({ config });
    
    console.log(`Seeding ${products.length} products...`);
    
    for (const product of products) {
      try {
        await payload.create({
          collection: 'products',
          data: product,
        });
        console.log(`✓ Created: ${product.name} (${product.productId})`);
      } catch (error: any) {
        console.error(`✗ Failed to create ${product.name}:`, error.message);
      }
    }
    
    console.log('\n✅ Product seed completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seedProducts();
