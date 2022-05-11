/* eslint-disable import/prefer-default-export */
import { Construct } from 'constructs';
import { IntegrationTestStack } from '@andybalham/cdk-cloud-test-kit';
import { Topic } from 'aws-cdk-lib/aws-sns';
import SimpleEventRouterConstruct from './SimpleEventRouter';

export class SimpleEventRouterTestStack extends IntegrationTestStack {
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
      testStackId: SimpleEventRouterTestStack.Id,
      testFunctionIds: [
        SimpleEventRouterTestStack.PositiveOutputTopicSubscriberId,
        SimpleEventRouterTestStack.NegativeOutputTopicSubscriberId,
      ],
    });

    const testInputTopic = new Topic(
      this,
      SimpleEventRouterTestStack.TestInputTopicId
    );

    this.addTestResourceTag(
      testInputTopic,
      SimpleEventRouterTestStack.TestInputTopicId
    );

    const sut = new SimpleEventRouterConstruct(this, 'SUT', {
      inputTopic: testInputTopic,
    });

    this.addSNSTopicSubscriber(
      sut.positiveOutputTopic,
      SimpleEventRouterTestStack.PositiveOutputTopicSubscriberId
    );

    this.addSNSTopicSubscriber(
      sut.negativeOutputTopic,
      SimpleEventRouterTestStack.NegativeOutputTopicSubscriberId
    );
  }
}
