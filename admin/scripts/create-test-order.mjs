import { generateClient } from 'aws-amplify/data';
import { Amplify } from 'aws-amplify';
import { readFileSync } from 'fs';
import { fetchAuthSession } from 'aws-amplify/auth';
import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";

const outputs = JSON.parse(readFileSync('amplify_outputs.json', 'utf8'));
Amplify.configure(outputs);

// Use authenticated client (userPool mode)
const client = generateClient({ authMode: 'userPool' });

async function createTestOrder() {
    console.log("Creating test order with authenticated user...");
    console.log("Note: This requires you to be logged in via the Dashboard first.");
    console.log("If this fails, make sure you're logged into the Dashboard in your browser.\n");

    const testOrder = {
        userId: "c2d55424-f091-7021-8959-573db08b502a", // Your actual user ID
        customerEmail: "daniel.lalanza01@gmail.com",
        customerName: "Daniel Lalanza (Test)",
        customerCompany: "Protex Wear Test",
        items: JSON.stringify([
            {
                productId: "test-product-1",
                name: "Test Product",
                quantity: 2,
                price: 99.99
            }
        ]),
        subtotal: 199.98,
        taxAmount: 42.00,
        shippingAmount: 10.00,
        totalAmount: 251.98,
        status: "PENDING",
        shippingAddress: JSON.stringify({
            street: "Calle Test 123",
            city: "Madrid",
            state: "Madrid",
            postalCode: "28001",
            country: "España"
        }),
        paymentMethod: "credit_card",
        paymentStatus: "PENDING",
        orderDate: new Date().toISOString()
    };

    try {
        const result = await client.models.Order.create(testOrder);

        if (result.errors && result.errors.length > 0) {
            console.error("❌ Error creating test order:", result.errors);
            console.log("\nThis is expected if you're not logged in.");
            console.log("Solution: Open the Dashboard in your browser, log in, then run this script again.");
            return;
        }

        console.log("✅ Test order created successfully!");
        console.log("Order ID:", result.data?.id);
        console.log("\nNow refresh your Dashboard → Orders to see if it appears.");
    } catch (error) {
        console.error("❌ Failed to create test order:", error);
        console.log("\nMake sure you're logged into the Dashboard first!");
    }
}

createTestOrder();
