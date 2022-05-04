/* eslint-disable no-new */
import * as cdk from 'aws-cdk-lib';
import { SimpleEventRouterTestStack as FinalStack } from './simple-event-router-final/SimpleEventRouterTestStack';
import { SimpleEventRouterTestStack as DemoStack } from './simple-event-router-demo/SimpleEventRouterTestStack';

const app = new cdk.App();
cdk.Tags.of(app).add('app', 'cdk-day-testing-in-the-cloud');

new FinalStack(app, FinalStack.Id);
new DemoStack(app, DemoStack.Id);
