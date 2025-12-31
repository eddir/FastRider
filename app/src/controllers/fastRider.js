import prisma from "../utils/prismaClient.js";
import {generateSlots} from "../utils/slots.js";

// List attractions that support FastRider
export const getAttractions = async (req, res) => {
    try {
        const attractions = await prisma.attraction.findMany({
            where: { supportsFastRider: true },
        });
        res.json(attractions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Book nearest available ticket
export const bookTicket = async (req, res) => {
    try {
        const userId = req.user.id;

        const { attractionId } = req.body;

        // Check if user already has an active ticket
        const activeTicket = await prisma.fastRiderTicket.findFirst({
            where: {
                userId,
                cancelledAt: null,
                slotEnd: { gt: new Date() },
            },
        });
        if (activeTicket) return res.status(400).json({ message: "User already has an active ticket." });

        const attraction = await prisma.attraction.findUnique({ where: { id: attractionId } });
        if (!attraction || !attraction.supportsFastRider) {
            return res.status(400).json({ message: "Invalid attraction or FastRider not supported." });
        }

        // Generate today's slots
        const slots = await generateSlots(attraction); // function we’ll define separately

        // Find nearest available slot
        const availableSlot = slots.find(s => s.remainingTickets > 0);
        if (!availableSlot) return res.status(400).json({ message: "No available slots today." });

        const ticket = await prisma.fastRiderTicket.create({
            data: {
                userId,
                attractionId,
                slotStart: availableSlot.start,
                slotEnd: availableSlot.end,
            },
        });

        res.json(ticket);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get active ticket for a user
export const getMyTicket = async (req, res) => {
    const userId = req.user.id;
    try {
        const ticket = await prisma.fastRiderTicket.findFirst({
            where: { userId, cancelledAt: null, slotEnd: { gt: new Date() } },
            include: { attraction: true },
        });
        res.json(ticket || { message: "No active ticket" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Cancel active ticket
export const cancelTicket = async (req, res) => {
    const userId = req.user.id;
    try {
        const ticket = await prisma.fastRiderTicket.findFirst({
            where: { userId, cancelledAt: null, slotEnd: { gt: new Date() } },
        });

        if (!ticket) return res.status(400).json({ message: "No active ticket to cancel." });

        const cancelled = await prisma.fastRiderTicket.update({
            where: { id: ticket.id },
            data: { cancelledAt: new Date() },
        });

        res.json({ message: "Ticket cancelled", ticket: cancelled });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
