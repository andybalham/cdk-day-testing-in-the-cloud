/* eslint-disable no-new */
import * as cdk from 'aws-cdk-lib';
import SimpleEventRouterTestStack from './simple-event-router/SimpleEventRouterTestStack';

const app = new cdk.App();
cdk.Tags.of(app).add('app', 'ExamplesApp');

new SimpleEventRouterTestStack(app, SimpleEventRouterTestStack.Id);