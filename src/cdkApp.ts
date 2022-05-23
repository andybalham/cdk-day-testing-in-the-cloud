/* eslint-disable no-new */
import { App, Tags } from 'aws-cdk-lib';
import { SimpleEventRouterTestStack } from './simple-event-router-demo/SimpleEventRouterTestStack';
import { SimpleEventRouterTestStackFinal } from './simple-event-router-final/SimpleEventRouterTestStack';

const app = new App();
Tags.of(app).add('app', 'cdk-day-testing-in-the-cloud');

new SimpleEventRouterTestStack(app, SimpleEventRouterTestStack.Id);
new SimpleEventRouterTestStackFinal(app, SimpleEventRouterTestStackFinal.Id);
