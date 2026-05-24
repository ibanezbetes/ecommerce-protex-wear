
import { CognitoIdentityProviderClient, AdminAddUserToGroupCommand } from "@aws-sdk/client-cognito-identity-provider";
import { readFileSync } from 'fs';

console.log("Starting script...");
const outputs = JSON.parse(readFileSync('amplify_outputs.json', 'utf8'));
const userPoolId = outputs.auth.user_pool_id;
const region = outputs.auth.aws_region;
const email = process.argv[2];

if (!email) {
    console.error("Please provide an email address as an argument.");
    process.exit(1);
}

const client = new CognitoIdentityProviderClient({ region });

const command = new AdminAddUserToGroupCommand({
    UserPoolId: userPoolId,
    Username: email,
    GroupName: "ADMIN",
});

try {
    await client.send(command);
    console.log(`Successfully added user ${email} to group ADMIN`);
} catch (error) {
    console.error("Error adding user to group:", error);
}
