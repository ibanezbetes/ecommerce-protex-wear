import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { ProtexWearInfraStack } from '../lib/protex-wear-infra-stack';

describe('ProtexWearInfraStack', () => {
  let app: cdk.App;
  let stack: ProtexWearInfraStack;
  let template: Template;

  beforeEach(() => {
    app = new cdk.App();
    stack = new ProtexWearInfraStack(app, 'TestStack');
    template = Template.fromStack(stack);
  });

  test('Stack can be created', () => {
    // Basic test to ensure stack can be synthesized
    expect(template).toBeDefined();
  });

  // Feature: aws-cdk-infrastructure, Property 1: Lightsail Instance Configuration
  test('Lightsail instance has correct configuration', () => {
    // Verify that a Lightsail instance exists with the correct properties
    template.hasResourceProperties('AWS::Lightsail::Instance', {
      BlueprintId: 'wordpress',
      BundleId: 'nano_3_0',
      AvailabilityZone: 'eu-west-1a',
      InstanceName: 'protex-wear-wordpress'
    });
  });

  test('Lightsail instance uses WordPress blueprint', () => {
    // Verify specifically that WordPress blueprint is used (Bitnami certified)
    template.hasResourceProperties('AWS::Lightsail::Instance', {
      BlueprintId: 'wordpress'
    });
  });

  test('Lightsail instance uses nano_3_0 bundle for cost optimization', () => {
    // Verify the $5/month bundle is used to keep costs low
    template.hasResourceProperties('AWS::Lightsail::Instance', {
      BundleId: 'nano_3_0'
    });
  });

  test('Lightsail instance is in eu-west-1a availability zone', () => {
    // Verify European zone for latency optimization
    template.hasResourceProperties('AWS::Lightsail::Instance', {
      AvailabilityZone: 'eu-west-1a'
    });
  });

  test('Only one Lightsail instance is created', () => {
    // Verify we don't accidentally create multiple instances
    template.resourceCountIs('AWS::Lightsail::Instance', 1);
  });

  // Feature: aws-cdk-infrastructure, Property 2: Static IP Creation and Association
  test('Static IP is created and associated with instance', () => {
    // Verify that a static IP exists with correct properties
    template.hasResourceProperties('AWS::Lightsail::StaticIp', {
      StaticIpName: 'protex-wear-static-ip',
      AttachedTo: 'protex-wear-wordpress'
    });
  });

  test('Static IP has correct name for Cloudflare integration', () => {
    // Verify the static IP name follows naming convention
    template.hasResourceProperties('AWS::Lightsail::StaticIp', {
      StaticIpName: 'protex-wear-static-ip'
    });
  });

  test('Static IP is attached to the correct instance', () => {
    // Verify the static IP is attached to our WordPress instance
    template.hasResourceProperties('AWS::Lightsail::StaticIp', {
      AttachedTo: 'protex-wear-wordpress'
    });
  });

  test('Only one static IP is created', () => {
    // Verify we don't accidentally create multiple static IPs
    template.resourceCountIs('AWS::Lightsail::StaticIp', 1);
  });

  test('Static IP depends on instance creation', () => {
    // Verify proper dependency order for deployment
    const staticIpResources = template.findResources('AWS::Lightsail::StaticIp');
    const staticIpResource = Object.values(staticIpResources)[0];
    
    expect(staticIpResource.DependsOn).toContain('ProtexWearInstance');
  });

  // Feature: aws-cdk-infrastructure, Property 4: User Data Script SWAP Configuration
  test('User data script contains SWAP file creation command', () => {
    // Get the instance resource and check UserData content
    const instanceResources = template.findResources('AWS::Lightsail::Instance');
    const instanceResource = Object.values(instanceResources)[0];
    const userData = instanceResource.Properties.UserData;
    
    // Verify the critical fallocate command for 2GB SWAP
    expect(userData).toContain('fallocate -l 2G /swapfile');
  });

  test('User data script contains SWAP security permissions', () => {
    // Get the instance resource and check UserData content
    const instanceResources = template.findResources('AWS::Lightsail::Instance');
    const instanceResource = Object.values(instanceResources)[0];
    const userData = instanceResource.Properties.UserData;
    
    // Verify SWAP file gets secure permissions (600)
    expect(userData).toContain('chmod 600 /swapfile');
  });

  test('User data script contains SWAP formatting command', () => {
    // Get the instance resource and check UserData content
    const instanceResources = template.findResources('AWS::Lightsail::Instance');
    const instanceResource = Object.values(instanceResources)[0];
    const userData = instanceResource.Properties.UserData;
    
    // Verify SWAP file gets formatted correctly
    expect(userData).toContain('mkswap /swapfile');
  });

  test('User data script contains SWAP activation command', () => {
    // Get the instance resource and check UserData content
    const instanceResources = template.findResources('AWS::Lightsail::Instance');
    const instanceResource = Object.values(instanceResources)[0];
    const userData = instanceResource.Properties.UserData;
    
    // Verify SWAP gets activated immediately
    expect(userData).toContain('swapon /swapfile');
  });

  test('User data script contains SWAP persistence in fstab', () => {
    // Get the instance resource and check UserData content
    const instanceResources = template.findResources('AWS::Lightsail::Instance');
    const instanceResource = Object.values(instanceResources)[0];
    const userData = instanceResource.Properties.UserData;
    
    // Verify SWAP persists across reboots via /etc/fstab
    expect(userData).toContain('/etc/fstab');
  });

  test('User data script contains OOM prevention logging', () => {
    // Get the instance resource and check UserData content
    const instanceResources = template.findResources('AWS::Lightsail::Instance');
    const instanceResource = Object.values(instanceResources)[0];
    const userData = instanceResource.Properties.UserData;
    
    // Verify script logs OOM prevention purpose
    expect(userData).toContain('OOM');
  });

  test('User data script has proper bash shebang', () => {
    // Get the instance resource and check UserData content
    const instanceResources = template.findResources('AWS::Lightsail::Instance');
    const instanceResource = Object.values(instanceResources)[0];
    const userData = instanceResource.Properties.UserData;
    
    // Verify script starts with proper bash shebang
    expect(userData).toMatch(/^#!/);
  });

  // Feature: aws-cdk-infrastructure, Property 5: User Data Script Bitnami Permissions
  test('User data script contains Bitnami ownership command', () => {
    // Get the instance resource and check UserData content
    const instanceResources = template.findResources('AWS::Lightsail::Instance');
    const instanceResource = Object.values(instanceResources)[0];
    const userData = instanceResource.Properties.UserData;
    
    // Verify correct ownership is set for wp-content
    expect(userData).toContain('chown -R bitnami:daemon /opt/bitnami/wordpress/wp-content');
  });

  test('User data script contains Bitnami group permissions', () => {
    // Get the instance resource and check UserData content
    const instanceResources = template.findResources('AWS::Lightsail::Instance');
    const instanceResource = Object.values(instanceResources)[0];
    const userData = instanceResource.Properties.UserData;
    
    // Verify group write permissions are set
    expect(userData).toContain('chmod -R g+w /opt/bitnami/wordpress/wp-content');
  });

  test('User data script checks for wp-content directory', () => {
    // Get the instance resource and check UserData content
    const instanceResources = template.findResources('AWS::Lightsail::Instance');
    const instanceResource = Object.values(instanceResources)[0];
    const userData = instanceResource.Properties.UserData;
    
    // Verify script checks for wp-content directory existence
    expect(userData).toContain('/opt/bitnami/wordpress/wp-content');
  });

  test('User data script contains Bitnami permissions logging', () => {
    // Get the instance resource and check UserData content
    const instanceResources = template.findResources('AWS::Lightsail::Instance');
    const instanceResource = Object.values(instanceResources)[0];
    const userData = instanceResource.Properties.UserData;
    
    // Verify script logs Bitnami permission configuration
    expect(userData).toContain('Bitnami');
  });

  test('User data script verifies permissions after setting', () => {
    // Get the instance resource and check UserData content
    const instanceResources = template.findResources('AWS::Lightsail::Instance');
    const instanceResource = Object.values(instanceResources)[0];
    const userData = instanceResource.Properties.UserData;
    
    // Verify script checks permissions after setting them
    expect(userData).toContain('ls -la');
  });
});