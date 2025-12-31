import request from "supertest";
import app from "../src/index.js"; // your Express app
import { generateToken } from "../src/utils/auth.js";
import prisma from "../src/utils/prismaClient.js";

describe("Book Ticket Endpoint", () => {
    let token;
    let userId;

    beforeAll(async () => {
        // Optionally create a test user in your DB
        const user = await prisma.user.create({
            data: { phoneNumber: "1234567890", password: "hashedpassword" },
        });
        userId = user.id;

        token = generateToken({ id: user.id, phoneNumber: user.phoneNumber });
    });

    afterAll(async () => {
        // Clean up test data
        await prisma.fastRiderTicket.deleteMany({ where: { userId } });
        await prisma.user.delete({ where: { id: userId } });
        await prisma.$disconnect();
    });

    it("should return 401 if no token is provided", async () => {
        const res = await request(app).post("/api/fastrider/book").send({ attractionId: 1 });
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe("No token provided");
    });

    it("should book a ticket successfully", async () => {
        const res = await request(app)
            .post("/api/fastrider/book")
            .set("Authorization", `Bearer ${token}`)
            .send({ attractionId: 1 }); // make sure attraction 1 exists and supports FastRider

        expect(res.statusCode).toBe(200);
        expect(res.body.userId).toBe(userId);
        expect(res.body.attractionId).toBe(1);
        expect(res.body.slotStart).toBeDefined();
        expect(res.body.slotEnd).toBeDefined();
    });

    it("should return 400 if user already has an active ticket", async () => {
        const res = await request(app)
            .post("/api/fastrider/book")
            .set("Authorization", `Bearer ${token}`)
            .send({ attractionId: 1 });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("User already has an active ticket.");
    });
});
