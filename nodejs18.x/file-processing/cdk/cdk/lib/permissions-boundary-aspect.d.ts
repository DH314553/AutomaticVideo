import { IAspect } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
export declare class PermissionsBoundaryAspect implements IAspect {
    private readonly arn;
    constructor(permissionBoundaryArn: string);
    visit(node: IConstruct): void;
}
