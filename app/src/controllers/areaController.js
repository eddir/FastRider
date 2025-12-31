import prisma from "../utils/prismaClient.js";

export const getAllAreas = async (req, res) => {
    try {
        const areas = await prisma.area.findMany();
        res.json(areas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAreaById = async (req, res) => {
    try {
        const { id } = req.params;
        const area = await prisma.area.findUnique({
            where: { id: parseInt(id) },
            include: { attractions: true, foodStands: true, restaurants: true },
        });

        if (!area) return res.status(404).json({ error: "Area not found" });
        res.json(area);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
