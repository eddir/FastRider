import prisma from "../utils/prismaClient.js";

export const getAttractions = async (req, res) => {
    try {
        const { areaId, type, minRating, sort } = req.query;

        const attractions = await prisma.attraction.findMany({
            where: {
                areaId: areaId ? parseInt(areaId) : undefined,
                type: type || undefined,
                rating: minRating ? { gte: parseFloat(minRating) } : undefined,
            },
            orderBy: sort ? { [sort]: "asc" } : undefined,
        });

        res.json(attractions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAttractionById = async (req, res) => {
    try {
        const { id } = req.params;
        const attraction = await prisma.attraction.findUnique({
            where: { id: parseInt(id) },
        });

        if (!attraction) return res.status(404).json({ error: "Attraction not found" });
        res.json(attraction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
