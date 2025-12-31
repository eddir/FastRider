// utils/slots.js
import prisma from "./prismaClient.js";

export const generateSlots = async (attraction) => {
    const slots = [];
    const now = new Date();
    const open = new Date();
    open.setHours(attraction.openTime.getHours(), attraction.openTime.getMinutes(), 0, 0);
    const close = new Date();
    close.setHours(attraction.closeTime.getHours(), attraction.closeTime.getMinutes(), 0, 0);

    const slotSizeMs = attraction.slotSizeMinutes * 60 * 1000;
    const numberOfSlots = Math.floor((close - open) / slotSizeMs);
    const ticketsPerSlot = Math.floor(attraction.ticketsPerDay / numberOfSlots);

    for (let startTime = open.getTime(); startTime < close.getTime(); startTime += slotSizeMs) {
        const start = new Date(startTime);
        const end = new Date(startTime + slotSizeMs);

        // Count booked tickets in this slot
        const bookedCount = await prisma.fastRiderTicket.count({
            where: {
                attractionId: attraction.id,
                cancelledAt: null,
                slotStart: { lte: start },
                slotEnd: { gt: start },
            },
        });

        slots.push({
            start,
            end,
            remainingTickets: ticketsPerSlot - bookedCount,
        });
    }

    return slots.filter(slot => slot.start > now);
};
