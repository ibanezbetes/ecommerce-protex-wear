
import {
    CognitoIdentityProviderClient,
    AdminCreateUserCommand,
    AdminSetUserPasswordCommand,
    ListUsersCommand
} from "@aws-sdk/client-cognito-identity-provider";
import fs from 'fs';
import path from 'path';

// Read amplify_outputs.json
const outputsPath = path.join(process.cwd(), 'amplify_outputs.json');
const outputs = JSON.parse(fs.readFileSync(outputsPath, 'utf8'));

const userPoolId = outputs.auth.user_pool_id;
const region = outputs.auth.aws_region;

if (!userPoolId) {
    console.error("Could not find user_pool_id in amplify_outputs.json");
    process.exit(1);
}

const client = new CognitoIdentityProviderClient({ region });

async function createOrUpdateUser(email, password) {
    try {
        console.log(`Processing user ${email}...`);

        let created = false;
        try {
            await client.send(new AdminCreateUserCommand({
                UserPoolId: userPoolId,
                Username: email,
                UserAttributes: [
                    { Name: 'email', Value: email },
                    { Name: 'email_verified', Value: 'true' }
                ],
                MessageAction: 'SUPPRESS'
            }));
            created = true;
            console.log(`   User created.`);
        } catch (e) {
            if (e.name === 'UsernameExistsException') {
                console.log(`   User already exists.`);
            } else {
                throw e;
            }
        }

        // Set Password
        await client.send(new AdminSetUserPasswordCommand({
            UserPoolId: userPoolId,
            Username: email,
            Password: password,
            Permanent: true
        }));
        console.log(`   Password set to '${password}' successfully.`);

    } catch (error) {
        console.error(`   ❌ Error for ${email}:`, error.message);
    }
}

async function listAllUsers() {
    console.log('\nCurrent Users in Pool:');
    try {
        const response = await client.send(new ListUsersCommand({
            UserPoolId: userPoolId
        }));
        response.Users.forEach(u => {
            console.log(` - ${u.Username} (Status: ${u.UserStatus}, Enabled: ${u.Enabled})`);
        });
    } catch (e) {
        console.error("Error listing users:", e.message);
    }
}

async function main() {
    // Upsert users with Strong Password
    const password = 'Password123!';
    await createOrUpdateUser('cliente@demo.com', password);
    await createOrUpdateUser('admin@demo.com', password);

    await listAllUsers();
}

main();
