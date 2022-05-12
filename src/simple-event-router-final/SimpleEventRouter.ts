import { Construct } from 'constructs';
import { ITopic, Topic } from 'aws-cdk-lib/aws-sns';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';

export interface SimpleEventRouterProps {
  inputTopic: ITopic;
}

export default class SimpleEventRouterConstruct extends Construct {
  //
  readonly positiveOutputTopic: ITopic;

  readonly negativeOutputTopic: ITopic;

  constructor(scope: Construct, id: string, props: SimpleEventRouterProps) {
    super(scope, id);

    this.positiveOutputTopic = new Topic(this, 'PositiveOutputTopic');
    this.negativeOutputTopic = new Topic(this, 'NegativeOutputTopic');

    const simpleEventRouterFunction = new NodejsFunction(
      scope,
      'RouterFunction',
      {
        environment: {
          POSITIVE_OUTPUT_TOPIC_ARN: this.positiveOutputTopic.topicArn,
          NEGATIVE_OUTPUT_TOPIC_ARN: this.negativeOutputTopic.topicArn,
        },
      }
    );

    props.inputTopic.addSubscription(
      new LambdaSubscription(simpleEventRouterFunction)
    );

    this.positiveOutputTopic.grantPublish(simpleEventRouterFunction);
    this.negativeOutputTopic.grantPublish(simpleEventRouterFunction);
  }
}
