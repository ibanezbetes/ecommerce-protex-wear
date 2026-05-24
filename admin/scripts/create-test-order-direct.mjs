import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({
    region: "eu-west-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const docClient = DynamoDBDocumentClient.from(client);

async function createTestOrder() {
    const orderId = randomUUID();
    const now = new Date().toISOString();

    const order = {
        id: orderId,
        __typename: "Order",
        userId: "c2d55424-f091-7021-8959-573db08b502a",
        owner: "daniel.lalanza01@gmail.com",
        customerEmail: "daniel.lalanza01@gmail.com",
        customerName: "Daniel Lalanza (Test)",
        customerCompany: "Protex Wear Test",
        items: JSON.stringify([
            {
                productId: "test-product-1",
                name: "Producto de Prueba",
                sku: "TEST-001",
                quantity: 2,
                price: 99.99
            }
        ]),
        subtotal: 199.98,
        taxAmount: 42.00,
        shippingAmount: 10.00,
        discountAmount: 0,
        totalAmount: 251.98,
        status: "PENDING",
        shippingAddress: JSON.stringify({
            street: "Calle Test 123",
            city: "Madrid",
            state: "Madrid",
            postalCode: "28001",
            country: "España"
        }),
        billingAddress: JSON.stringify({
            street: "Calle Test 123",
            city: "Madrid",
            state: "Madrid",
            postalCode: "28001",
            country: "España"
        }),
        paymentMethod: "credit_card",
        paymentStatus: "PENDING",
        orderDate: now,
        createdAt: now,
        updatedAt: now
    };

    const command = new PutCommand({
        TableName: "Order-704f39d7b9-NONE", // Your DynamoDB table name
        Item: order
    });

    try {
        await docClient.send(command);
        console.log("✅ Test order created successfully!");
        console.log("Order ID:", orderId);
        console.log("\nNow refresh your Dashboard → Orders to see it.");
    } catch (error) {
        console.error("❌ Error creating order:", error);
    }
}

createTestOrder();
