import prisma from "../utils/prismaClient.js";

export const searchParkItems = async (req, res) => {
    try {
        const { q, type, areaId } = req.query;
        let results = [];

        if (!type || type === "attraction") {
            const attractions = await prisma.attraction.findMany({
                where: {
                    name: { contains: q, mode: "insensitive" },
                    areaId: areaId ? parseInt(areaId) : undefined,
                },
            });
            results.push(...attractions.map(a => ({ ...a, type: "attraction" })));
        }

        if (!type || type === "foodStand") {
            const stands = await prisma.foodStand.findMany({
                where: {
                    name: { contains: q, mode: "insensitive" },
                    areaId: areaId ? parseInt(areaId) : undefined,
                },
            });
            results.push(...stands.map(s => ({ ...s, type: "foodStand" })));
        }

        if (!type || type === "restaurant") {
            const restaurants = await prisma.restaurant.findMany({
                where: {
                    name: { contains: q, mode: "insensitive" },
                    areaId: areaId ? parseInt(areaId) : undefined,
                },
            });
            results.push(...restaurants.map(r => ({ ...r, type: "restaurant" })));
        }

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
