# Implementation Plan: AWS CDK Infrastructure

## Overview

Plan de implementación para crear la infraestructura AWS CDK de Protex Wear. Se implementará usando TypeScript con aws-cdk-lib, creando una instancia Lightsail con WordPress, IP estática, y configuración automática de SWAP y permisos. El enfoque es incremental, validando cada componente antes de continuar.

## Tasks

- [x] 1. Setup CDK project structure and dependencies
  - Create infra/ directory in project root
  - Initialize CDK TypeScript project with proper dependencies
  - Configure CDK app entry point and basic stack structure
  - _Requirements: 5.3, 5.4_

- [ ] 2. Implement core Lightsail instance configuration
  - [x] 2.1 Create ProtexWearInfraStack class with Lightsail instance
    - Define CfnInstance with wordpress blueprint and nano_3_0 bundle
    - Configure availability zone eu-west-1a and instance naming
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 2.2 Write property test for Lightsail instance configuration
    - **Property 1: Lightsail Instance Configuration**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4**

- [ ] 3. Implement static IP creation and association
  - [x] 3.1 Add CfnStaticIp and CfnStaticIpAttachment resources
    - Create static IP with proper naming convention
    - Associate static IP to Lightsail instance
    - _Requirements: 2.1, 2.2, 2.4_

  - [x] 3.2 Write property test for static IP creation and association
    - **Property 2: Static IP Creation and Association**
    - **Validates: Requirements 2.1, 2.2**

- [ ] 4. Create user data script for SWAP and permissions
  - [x] 4.1 Implement user data script generation function
    - Create bash script with SWAP configuration (2GB fallocate)
    - Add Bitnami permissions configuration for wp-content
    - Include proper error handling and logging
    - _Requirements: 3.1, 3.2, 3.3, 4.1, 4.2, 4.3_

  - [x] 4.2 Write property test for user data script SWAP configuration
    - **Property 4: User Data Script SWAP Configuration**
    - **Validates: Requirements 3.1, 3.2, 3.3**

  - [x] 4.3 Write property test for user data script Bitnami permissions
    - **Property 5: User Data Script Bitnami Permissions**
    - **Validates: Requirements 4.1, 4.2, 4.3**

- [ ] 5. Integrate user data script with Lightsail instance
  - [ ] 5.1 Attach user data script to instance configuration
    - Configure userData property in CfnInstance
    - Ensure script executes on first boot
    - _Requirements: 3.4_

  - [ ] 5.2 Write property test for user data script integration
    - **Property 6: User Data Script Integration**
    - **Validates: Requirements 3.4**

- [ ] 6. Checkpoint - Ensure core infrastructure tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement stack outputs and access information
  - [x] 7.1 Add CloudFormation outputs for IP and access info
    - Output static IP address for Cloudflare configuration
    - Include SSH command and WordPress URL
    - Add credentials retrieval command
    - _Requirements: 2.3, 6.1, 6.2, 6.3_

  - [ ] 7.2 Write property test for stack output completeness
    - **Property 3: Stack Output Completeness**
    - **Validates: Requirements 2.3, 6.1, 6.2**

- [ ] 8. Add CDK deployment configuration and scripts
  - [ ] 8.1 Create deployment scripts and configuration
    - Add package.json scripts for deploy/destroy operations
    - Configure CDK context and environment settings
    - Create deployment documentation
    - _Requirements: 5.1, 5.2_

  - [ ] 8.2 Write property test for CDK idempotency
    - **Property 7: CDK Idempotency**
    - **Validates: Requirements 5.1**

  - [ ] 8.3 Write property test for resource cleanup
    - **Property 8: Resource Cleanup**
    - **Validates: Requirements 5.2**

- [ ] 9. Create comprehensive documentation and troubleshooting guide
  - [ ] 9.1 Write deployment and post-deployment documentation
    - Document complete deployment process
    - Include troubleshooting commands and verification steps
    - Add next steps for Cloudflare configuration
    - _Requirements: 6.4_

- [ ] 10. Final checkpoint - Complete deployment test
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Focus on creating minimal, working infrastructure first
- User data script is critical for preventing OOM issues during data import