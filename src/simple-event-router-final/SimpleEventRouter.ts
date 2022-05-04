import { Construct } from 'constructs';
import {
  aws_sns as sns,
  aws_sns_subscriptions as snsSubs,
  aws_lambda_nodejs as lambdaNodejs,
} from 'aws-cdk-lib';

export interface SimpleEventRouterProps {
  inputTopic: sns.ITopic;
}

export default class SimpleEventRouterConstruct extends Construct {
  //
  readonly positiveOutputTopic: sns.ITopic;

  readonly negativeOutputTopic: sns.ITopic;

  constructor(scope: Construct, id: string, props: SimpleEventRouterProps) {
    super(scope, id);

    const outputTopicProps = {};

    this.positiveOutputTopic = new sns.Topic(
      this,
      'PositiveOutputTopic',
      outputTopicProps
    );

    this.negativeOutputTopic = new sns.Topic(
      this,
      'NegativeOutputTopic',
      outputTopicProps
    );

    const simpleEventRouterFunction = new lambdaNodejs.NodejsFunction(
      scope,
      'RouterFunction',
      {
        environment: {
          INPUT_TOPIC_ARN: props.inputTopic.topicArn,
          POSITIVE_OUTPUT_TOPIC_ARN: this.positiveOutputTopic.topicArn,
          NEGATIVE_OUTPUT_TOPIC_ARN: this.negativeOutputTopic.topicArn,
        },
      }
    );

    props.inputTopic.addSubscription(
      new snsSubs.LambdaSubscription(simpleEventRouterFunction)
    );

    this.positiveOutputTopic.grantPublish(simpleEventRouterFunction);
    this.negativeOutputTopic.grantPublish(simpleEventRouterFunction);
  }
}
