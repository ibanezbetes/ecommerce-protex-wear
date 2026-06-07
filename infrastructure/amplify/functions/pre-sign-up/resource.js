"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preSignUp = void 0;
const backend_1 = require("@aws-amplify/backend");
exports.preSignUp = (0, backend_1.defineFunction)({
    name: 'pre-sign-up',
    entry: './handler.ts',
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxrREFBc0Q7QUFFekMsUUFBQSxTQUFTLEdBQUcsSUFBQSx3QkFBYyxFQUFDO0lBQ3RDLElBQUksRUFBRSxhQUFhO0lBQ25CLEtBQUssRUFBRSxjQUFjO0NBQ3RCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGRlZmluZUZ1bmN0aW9uIH0gZnJvbSAnQGF3cy1hbXBsaWZ5L2JhY2tlbmQnO1xyXG5cclxuZXhwb3J0IGNvbnN0IHByZVNpZ25VcCA9IGRlZmluZUZ1bmN0aW9uKHtcclxuICBuYW1lOiAncHJlLXNpZ24tdXAnLFxyXG4gIGVudHJ5OiAnLi9oYW5kbGVyLnRzJyxcclxufSk7Il19