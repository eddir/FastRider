import prisma from "../utils/prismaClient.js";

export const getFoodStands = async (req, res) => {
    try {
        const { areaId, type, minRating, sort } = req.query;

        const stands = await prisma.foodStand.findMany({
            where: {
                areaId: areaId ? parseInt(areaId) : undefined,
                type: type || undefined,
                rating: minRating ? { gte: parseFloat(minRating) } : undefined,
            },
            orderBy: sort ? { [sort]: "asc" } : undefined,
        });

        res.json(stands);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getFoodStandById = async (req, res) => {
    try {
        const { id } = req.params;
        const stand = await prisma.foodStand.findUnique({
            where: { id: parseInt(id) },
        });

        if (!stand) return res.status(404).json({ error: "Food stand not found" });
        res.json(stand);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
