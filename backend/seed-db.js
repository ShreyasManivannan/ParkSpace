
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const existing = await prisma.space.count();
    if (existing > 0) {
        console.log('Database already has data. Skipping seed.');
        return;
    }

    // Create a default owner first
    const owner = await prisma.user.create({
        data: {
            name: 'Demo Owner',
            email: 'owner@example.com',
            password: 'hashed_password_placeholder', // In a real app, hash this
            role: 'OWNER'
        }
    });

    const spaces = [
        {
            title: 'Downtown Executive Spot',
            description: 'Prime location secure parking with 24/7 surveillance.',
            address: '123 Business Blvd, New York, NY',
            latitude: 40.7128,
            longitude: -74.0060,
            pricePerHour: 15,
            ownerId: owner.id,
            imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        },
        {
            title: 'Luxury Garage Space',
            description: 'Heated indoor parking, perfect for high-end vehicles.',
            address: '456 Park Ave, New York, NY',
            latitude: 40.7615,
            longitude: -73.9776,
            pricePerHour: 25,
            ownerId: owner.id,
            imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        },
        {
            title: 'Central Station Parking',
            description: 'Convenient access to all major transit lines.',
            address: '89 Grand Central, New York, NY',
            latitude: 40.7527,
            longitude: -73.9772,
            pricePerHour: 12,
            ownerId: owner.id,
            imageUrl: 'https://images.unsplash.com/photo-1470224114660-3f6686c562eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        }
    ];

    for (const space of spaces) {
        await prisma.space.create({ data: space });
    }

    console.log('Database seeded successfully!');
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
