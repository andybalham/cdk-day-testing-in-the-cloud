/* eslint-disable import/prefer-default-export */
import { Construct } from 'constructs';
import { IntegrationTestStack } from '@andybalham/cdk-cloud-test-kit';
// cdk-day-stack-imports

export class SimpleEventRouterTestStack extends IntegrationTestStack {
  //
  static readonly Id = 'SimpleEventRouterTestStack';

  // cdk-day-test-resource-ids

  constructor(scope: Construct, id: string) {
    //
    super(scope, id, {
      testStackId: SimpleEventRouterTestStack.Id,
      // cdk-day-test-functions
    });

    // cdk-day-test-driver

    // // cdk-day-sut

    // cdk-day-topic-subscribers
  }
}
