"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsBoundaryAspect = void 0;
const iam = require("aws-cdk-lib/aws-iam");
class PermissionsBoundaryAspect {
    constructor(permissionBoundaryArn) {
        this.arn = permissionBoundaryArn;
    }
    visit(node) {
        if (node instanceof iam.Role) {
            const roleResource = node.node.findChild('Resource');
            roleResource.addPropertyOverride('PermissionsBoundary', this.arn);
        }
    }
}
exports.PermissionsBoundaryAspect = PermissionsBoundaryAspect;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVybWlzc2lvbnMtYm91bmRhcnktYXNwZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGVybWlzc2lvbnMtYm91bmRhcnktYXNwZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDJDQUEyQztBQUkzQyxNQUFhLHlCQUF5QjtJQUdsQyxZQUFZLHFCQUE2QjtRQUNyQyxJQUFJLENBQUMsR0FBRyxHQUFHLHFCQUFxQixDQUFDO0lBQ3JDLENBQUM7SUFFTSxLQUFLLENBQUMsSUFBZ0I7UUFDekIsSUFBSSxJQUFJLFlBQVksR0FBRyxDQUFDLElBQUksRUFBRTtZQUMxQixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQWdCLENBQUM7WUFDcEUsWUFBWSxDQUFDLG1CQUFtQixDQUFDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNyRTtJQUNMLENBQUM7Q0FDSjtBQWJELDhEQWFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUFzcGVjdCB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCB7IElDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuXG5leHBvcnQgY2xhc3MgUGVybWlzc2lvbnNCb3VuZGFyeUFzcGVjdCBpbXBsZW1lbnRzIElBc3BlY3Qge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgYXJuOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihwZXJtaXNzaW9uQm91bmRhcnlBcm46IHN0cmluZykge1xuICAgICAgICB0aGlzLmFybiA9IHBlcm1pc3Npb25Cb3VuZGFyeUFybjtcbiAgICB9XG5cbiAgICBwdWJsaWMgdmlzaXQobm9kZTogSUNvbnN0cnVjdCk6IHZvaWQge1xuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIGlhbS5Sb2xlKSB7XG4gICAgICAgICAgICBjb25zdCByb2xlUmVzb3VyY2UgPSBub2RlLm5vZGUuZmluZENoaWxkKCdSZXNvdXJjZScpIGFzIGlhbS5DZm5Sb2xlO1xuICAgICAgICAgICAgcm9sZVJlc291cmNlLmFkZFByb3BlcnR5T3ZlcnJpZGUoJ1Blcm1pc3Npb25zQm91bmRhcnknLCB0aGlzLmFybik7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=