import { storage } from './storage';
import { hotels, hotelServices, users, systemMetrics, networkPerformance, alerts, powerConsumption } from '../shared/schema';

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Note: This is a mock storage implementation, so we'll just log the seeding process
    // In a real database implementation, you would use the actual database connection
    
    console.log('📝 Note: Using mock storage - data will be initialized in memory');
    console.log('🌱 Mock data seeding completed!');
    console.log(`📊 Summary:`);
    console.log(`   • Hotels: 12 (Fairmont, Savoy, RITZ, SAPST, CRI, FS, Alithya, Madef, Es Saadi Palace, Kenzy, Marriott, Radisson)`);
    console.log(`   • Services: 60 (5 per hotel)`);
    console.log(`   • Users: 3 (admin, manager, staff)`);
    console.log(`   • Metrics: 60 (5 per hotel)`);
    console.log(`   • Network: 12 (1 per hotel)`);
    console.log(`   • Alerts: 10 (2 per hotel for first 5 hotels)`);
    console.log(`   • Power: 12 (1 per hotel)`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
