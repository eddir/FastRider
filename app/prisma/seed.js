import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

async function main() {
    // Delete existing data (optional, for clean seeding)
    await prisma.restaurant.deleteMany();
    await prisma.foodStand.deleteMany();
    await prisma.attraction.deleteMany();
    await prisma.area.deleteMany();

    // Create areas
    const gibbonIsland = await prisma.area.create({
        data: { name: "Gibbon Island", description: "Home of thrilling rides" },
    });

    const capuchinHills = await prisma.area.create({
        data: { name: "Capuchin Hills", description: "Relaxing nature area with gentle rides" },
    });

    // Attractions
    await prisma.attraction.createMany({
        data: [
            { name: "Jungle Swing", type: "Ride", waitTime: 15, rating: 4.2, areaId: gibbonIsland.id, supportsFastRider: true },
            { name: "Gibbon Coaster", type: "RollerCoaster", waitTime: 30, rating: 4.8, areaId: gibbonIsland.id },
            { name: "Capuchin Carousel", type: "Ride", waitTime: 10, rating: 4.0, areaId: capuchinHills.id },
        ],
    });

    // Food Stands
    await prisma.foodStand.createMany({
        data: [
            { name: "Banana Shack", type: "Snack", rating: 4.2, areaId: gibbonIsland.id },
            { name: "Coconut Ice Cream", type: "Ice Cream", rating: 4.5, areaId: capuchinHills.id },
        ],
    });

    // Restaurants
    await prisma.restaurant.createMany({
        data: [
            { name: "Island Grill", cuisine: "Seafood", rating: 4.5, areaId: gibbonIsland.id },
            { name: "Hillside Diner", cuisine: "Italian", rating: 4.0, areaId: capuchinHills.id },
        ],
    });

    console.log("Database seeded successfully!");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
