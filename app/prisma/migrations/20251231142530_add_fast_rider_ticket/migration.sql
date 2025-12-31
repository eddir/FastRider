-- AlterTable
ALTER TABLE "Attraction" ADD COLUMN     "closeTime" TIMESTAMP(3) NOT NULL DEFAULT '2025-01-01 19:00:00 +00:00',
ADD COLUMN     "openTime" TIMESTAMP(3) NOT NULL DEFAULT '2025-01-01 09:00:00 +00:00',
ADD COLUMN     "slotSizeMinutes" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "supportsFastRider" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ticketsPerDay" INTEGER NOT NULL DEFAULT 100;

-- CreateTable
CREATE TABLE "FastRiderTicket" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "attractionId" INTEGER NOT NULL,
    "slotStart" TIMESTAMP(3) NOT NULL,
    "slotEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelledAt" TIMESTAMP(3),

    CONSTRAINT "FastRiderTicket_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FastRiderTicket" ADD CONSTRAINT "FastRiderTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FastRiderTicket" ADD CONSTRAINT "FastRiderTicket_attractionId_fkey" FOREIGN KEY ("attractionId") REFERENCES "Attraction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
