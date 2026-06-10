"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const backend_1 = require("@aws-amplify/backend");
/**
 * Define and configure your auth resource for Protex Wear
 * Multi-role authentication with ADMIN and CUSTOMER groups
 * Supports both login and user registration with automatic role assignment
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
exports.auth = (0, backend_1.defineAuth)({
    loginWith: {
        email: true,
    },
    userAttributes: {
        'custom:role': {
            dataType: 'String',
            mutable: true,
        },
        'custom:company': {
            dataType: 'String',
            mutable: true,
        },
    },
    groups: ['ADMIN', 'CUSTOMER'],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxrREFBa0Q7QUFFbEQ7Ozs7O0dBS0c7QUFDVSxRQUFBLElBQUksR0FBRyxJQUFBLG9CQUFVLEVBQUM7SUFDN0IsU0FBUyxFQUFFO1FBQ1QsS0FBSyxFQUFFLElBQUk7S0FDWjtJQUNELGNBQWMsRUFBRTtRQUNkLGFBQWEsRUFBRTtZQUNiLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLE9BQU8sRUFBRSxJQUFJO1NBQ2Q7UUFDRCxnQkFBZ0IsRUFBRTtZQUNoQixRQUFRLEVBQUUsUUFBUTtZQUNsQixPQUFPLEVBQUUsSUFBSTtTQUNkO0tBQ0Y7SUFDRCxNQUFNLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDO0NBQzlCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGRlZmluZUF1dGggfSBmcm9tICdAYXdzLWFtcGxpZnkvYmFja2VuZCc7XHJcblxyXG4vKipcclxuICogRGVmaW5lIGFuZCBjb25maWd1cmUgeW91ciBhdXRoIHJlc291cmNlIGZvciBQcm90ZXggV2VhclxyXG4gKiBNdWx0aS1yb2xlIGF1dGhlbnRpY2F0aW9uIHdpdGggQURNSU4gYW5kIENVU1RPTUVSIGdyb3Vwc1xyXG4gKiBTdXBwb3J0cyBib3RoIGxvZ2luIGFuZCB1c2VyIHJlZ2lzdHJhdGlvbiB3aXRoIGF1dG9tYXRpYyByb2xlIGFzc2lnbm1lbnRcclxuICogQHNlZSBodHRwczovL2RvY3MuYW1wbGlmeS5hd3MvZ2VuMi9idWlsZC1hLWJhY2tlbmQvYXV0aFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGF1dGggPSBkZWZpbmVBdXRoKHtcclxuICBsb2dpbldpdGg6IHtcclxuICAgIGVtYWlsOiB0cnVlLFxyXG4gIH0sXHJcbiAgdXNlckF0dHJpYnV0ZXM6IHtcclxuICAgICdjdXN0b206cm9sZSc6IHtcclxuICAgICAgZGF0YVR5cGU6ICdTdHJpbmcnLFxyXG4gICAgICBtdXRhYmxlOiB0cnVlLFxyXG4gICAgfSxcclxuICAgICdjdXN0b206Y29tcGFueSc6IHtcclxuICAgICAgZGF0YVR5cGU6ICdTdHJpbmcnLFxyXG4gICAgICBtdXRhYmxlOiB0cnVlLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIGdyb3VwczogWydBRE1JTicsICdDVVNUT01FUiddLFxyXG59KTtcclxuIl19