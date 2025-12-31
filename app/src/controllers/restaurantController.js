import prisma from "../utils/prismaClient.js";

export const getRestaurants = async (req, res) => {
    try {
        const { areaId, cuisine, minRating, sort } = req.query;

        const restaurants = await prisma.restaurant.findMany({
            where: {
                areaId: areaId ? parseInt(areaId) : undefined,
                cuisine: cuisine || undefined,
                rating: minRating ? { gte: parseFloat(minRating) } : undefined,
            },
            orderBy: sort ? { [sort]: "asc" } : undefined,
        });

        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getRestaurantById = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: parseInt(id) },
        });

        if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
