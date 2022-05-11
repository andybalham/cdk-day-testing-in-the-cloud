/* eslint-disable no-new */
import { App, Tags } from 'aws-cdk-lib';
import { SimpleEventRouterTestStack } from './simple-event-router-demo/SimpleEventRouterTestStack';

const app = new App();
Tags.of(app).add('app', 'cdk-day-testing-in-the-cloud');

new SimpleEventRouterTestStack(app, SimpleEventRouterTestStack.Id);
