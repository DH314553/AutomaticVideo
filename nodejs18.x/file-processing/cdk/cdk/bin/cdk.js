#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cdk_lib_1 = require("aws-cdk-lib");
const cdk_stack_1 = require("../lib/cdk-stack");
const permissions_boundary_aspect_1 = require("../lib/permissions-boundary-aspect");
const stack = new cdk_stack_1.CdkStack(new aws_cdk_lib_1.App(), 'CdkStack', { description: 'Lambda-S3 starter project' });
const { ACCOUNT_ID, PARTITION, REGION, STACK_NAME } = aws_cdk_lib_1.Aws;
const permissionBoundaryArn = `arn:${PARTITION}:iam::${ACCOUNT_ID}:policy/${STACK_NAME}-${REGION}-PermissionsBoundary`;
// Apply permissions boundary to the stack
aws_cdk_lib_1.Aspects.of(stack).add(new permissions_boundary_aspect_1.PermissionsBoundaryAspect(permissionBoundaryArn));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDZDQUFnRDtBQUVoRCxnREFBNEM7QUFDNUMsb0ZBQStFO0FBRy9FLE1BQU0sS0FBSyxHQUFHLElBQUksb0JBQVEsQ0FBQyxJQUFJLGlCQUFHLEVBQUUsRUFBRSxVQUFVLEVBQUUsRUFBRSxXQUFXLEVBQUUsMkJBQTJCLEVBQUUsQ0FBQyxDQUFDO0FBQ2hHLE1BQU0sRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxpQkFBRyxDQUFDO0FBQzFELE1BQU0scUJBQXFCLEdBQUcsT0FBTyxTQUFTLFNBQVMsVUFBVSxXQUFXLFVBQVUsSUFBSSxNQUFNLHNCQUFzQixDQUFDO0FBRXZILDBDQUEwQztBQUMxQyxxQkFBTyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSx1REFBeUIsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5pbXBvcnQgeyBBcHAsIEFzcGVjdHMsIEF3cyB9IGZyb20gJ2F3cy1jZGstbGliJztcblxuaW1wb3J0IHsgQ2RrU3RhY2sgfSBmcm9tICcuLi9saWIvY2RrLXN0YWNrJztcbmltcG9ydCB7IFBlcm1pc3Npb25zQm91bmRhcnlBc3BlY3QgfSBmcm9tICcuLi9saWIvcGVybWlzc2lvbnMtYm91bmRhcnktYXNwZWN0JztcblxuXG5jb25zdCBzdGFjayA9IG5ldyBDZGtTdGFjayhuZXcgQXBwKCksICdDZGtTdGFjaycsIHsgZGVzY3JpcHRpb246ICdMYW1iZGEtUzMgc3RhcnRlciBwcm9qZWN0JyB9KTtcbmNvbnN0IHsgQUNDT1VOVF9JRCwgUEFSVElUSU9OLCBSRUdJT04sIFNUQUNLX05BTUUgfSA9IEF3cztcbmNvbnN0IHBlcm1pc3Npb25Cb3VuZGFyeUFybiA9IGBhcm46JHtQQVJUSVRJT059OmlhbTo6JHtBQ0NPVU5UX0lEfTpwb2xpY3kvJHtTVEFDS19OQU1FfS0ke1JFR0lPTn0tUGVybWlzc2lvbnNCb3VuZGFyeWA7XG5cbi8vIEFwcGx5IHBlcm1pc3Npb25zIGJvdW5kYXJ5IHRvIHRoZSBzdGFja1xuQXNwZWN0cy5vZihzdGFjaykuYWRkKG5ldyBQZXJtaXNzaW9uc0JvdW5kYXJ5QXNwZWN0KHBlcm1pc3Npb25Cb3VuZGFyeUFybikpO1xuIl19