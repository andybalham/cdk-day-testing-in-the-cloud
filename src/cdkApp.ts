/* eslint-disable no-new */
import * as cdk from 'aws-cdk-lib';
import { SimpleEventRouterTestStack } from './simple-event-router-demo/SimpleEventRouterTestStack';

const app = new cdk.App();
cdk.Tags.of(app).add('app', 'cdk-day-testing-in-the-cloud');

new SimpleEventRouterTestStack(app, SimpleEventRouterTestStack.Id);
