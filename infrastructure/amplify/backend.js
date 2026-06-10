"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const backend_1 = require("@aws-amplify/backend");
const resource_1 = require("./auth/resource");
const resource_2 = require("./data/resource");
const resource_3 = require("./storage/resource");
/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
(0, backend_1.defineBackend)({
    auth: resource_1.auth,
    data: resource_2.data,
    storage: resource_3.storage,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2VuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJhY2tlbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxrREFBcUQ7QUFDckQsOENBQXVDO0FBQ3ZDLDhDQUF1QztBQUN2QyxpREFBNkM7QUFFN0M7O0dBRUc7QUFDSCxJQUFBLHVCQUFhLEVBQUM7SUFDWixJQUFJLEVBQUosZUFBSTtJQUNKLElBQUksRUFBSixlQUFJO0lBQ0osT0FBTyxFQUFQLGtCQUFPO0NBQ1IsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZGVmaW5lQmFja2VuZCB9IGZyb20gJ0Bhd3MtYW1wbGlmeS9iYWNrZW5kJztcclxuaW1wb3J0IHsgYXV0aCB9IGZyb20gJy4vYXV0aC9yZXNvdXJjZSc7XHJcbmltcG9ydCB7IGRhdGEgfSBmcm9tICcuL2RhdGEvcmVzb3VyY2UnO1xyXG5pbXBvcnQgeyBzdG9yYWdlIH0gZnJvbSAnLi9zdG9yYWdlL3Jlc291cmNlJztcclxuXHJcbi8qKlxyXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hbXBsaWZ5LmF3cy9yZWFjdC9idWlsZC1hLWJhY2tlbmQvIHRvIGFkZCBzdG9yYWdlLCBmdW5jdGlvbnMsIGFuZCBtb3JlXHJcbiAqL1xyXG5kZWZpbmVCYWNrZW5kKHtcclxuICBhdXRoLFxyXG4gIGRhdGEsXHJcbiAgc3RvcmFnZSxcclxufSk7XHJcbiJdfQ==