/* eslint-disable import/prefer-default-export */
import { Construct } from 'constructs';
import { IntegrationTestStack } from '@andybalham/cdk-cloud-test-kit';
import { Topic } from 'aws-cdk-lib/aws-sns';
import SimpleEventRouterConstruct from './SimpleEventRouter';

export class SimpleEventRouterTestStackFinal extends IntegrationTestStack {
  //
  static readonly Id = `SimpleEventRouterTestStack-Final`;

  static readonly TestInputTopicId = 'TestInputTopic';

  static readonly PositiveOutputTopicSubscriberId =
    'PositiveOutputTopicSubscriberFunction';

  static readonly NegativeOutputTopicSubscriberId =
    'NegativeOutputTopicSubscriberFunction';

  constructor(scope: Construct, id: string) {
    //
    super(scope, id, {
      testStackId: SimpleEventRouterTestStackFinal.Id,
      testFunctionIds: [
        SimpleEventRouterTestStackFinal.PositiveOutputTopicSubscriberId,
        SimpleEventRouterTestStackFinal.NegativeOutputTopicSubscriberId,
      ],
    });

    const testInputTopic = new Topic(
      this,
      SimpleEventRouterTestStackFinal.TestInputTopicId
    );

    this.addTestResourceTag(
      testInputTopic,
      SimpleEventRouterTestStackFinal.TestInputTopicId
    );

    const sut = new SimpleEventRouterConstruct(this, 'SUT', {
      inputTopic: testInputTopic,
    });

    this.addSNSTopicSubscriber(
      sut.positiveOutputTopic,
      SimpleEventRouterTestStackFinal.PositiveOutputTopicSubscriberId
    );

    this.addSNSTopicSubscriber(
      sut.negativeOutputTopic,
      SimpleEventRouterTestStackFinal.NegativeOutputTopicSubscriberId
    );
  }
}
