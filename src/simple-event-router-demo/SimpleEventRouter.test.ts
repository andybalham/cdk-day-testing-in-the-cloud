/* eslint-disable @typescript-eslint/no-unused-expressions */
import { SNSEvent, SNSEventRecord } from 'aws-lambda';
import { expect } from 'chai';
import {
  TestObservation,
  IntegrationTestClient,
  SNSTestClient,
} from '@andybalham/cdk-cloud-test-kit';
import { Event } from './Event';
import { SimpleEventRouterTestStack as TestStack } from './SimpleEventRouterTestStack';

describe('SimpleEventRouter Test Suite', () => {
  //
  const testClient = new IntegrationTestClient({
    testStackId: TestStack.Id,
  });

  let testInputTopic: SNSTestClient;

  before(async () => {
    await testClient.initialiseClientAsync();

    testInputTopic = testClient.getSNSTestClient(TestStack.TestInputTopicId);
  });

  beforeEach(async () => {
    await testClient.initialiseTestAsync();
  });

  it(`Routes positive sums`, async () => {
    // Arrange

    const testEvent: Event = {
      values: [1, 2, 3],
    };

    // Act

    await testInputTopic.publishEventAsync(testEvent);

    // Await

    const { observations, timedOut } = await testClient.pollTestAsync({
      until: async (o) => o.length > 0,
      intervalSeconds: 2,
      timeoutSeconds: 12,
    });

    // Assert

    expect(timedOut, 'timedOut').to.be.false;

    const positiveObservations = TestObservation.filterById(
      observations,
      TestStack.PositiveOutputTopicSubscriberId
    );

    const negativeObservations = TestObservation.filterById(
      observations,
      TestStack.NegativeOutputTopicSubscriberId
    );

    expect(positiveObservations.length).to.be.greaterThan(0);
    expect(negativeObservations.length).to.equal(0);

    const positiveEventRecords = TestObservation.getEventRecords<
      SNSEvent,
      SNSEventRecord
    >(positiveObservations);

    const routedEvent = JSON.parse(positiveEventRecords[0].Sns.Message);

    expect(routedEvent).to.deep.equal(testEvent);
  });

  [
    { values: [], isExpectedPositive: true },
    { values: [1, 2, 3], isExpectedPositive: true },
    { values: [1, 2, -3], isExpectedPositive: true },
    { values: [1, -2, -3], isExpectedPositive: false },
  ].forEach((theory) => {
    it(`Routes as expected: ${JSON.stringify(theory)}`, async () => {
      // Arrange

      const testEvent: Event = {
        values: theory.values,
      };

      // Act

      await testInputTopic.publishEventAsync(testEvent);

      // Await

      const { observations, timedOut } = await testClient.pollTestAsync({
        until: async (o) => o.length > 0,
      });

      // Assert

      expect(timedOut, 'timedOut').to.be.false;

      const positiveObservations = TestObservation.filterById(
        observations,
        TestStack.PositiveOutputTopicSubscriberId
      );

      const negativeObservations = TestObservation.filterById(
        observations,
        TestStack.NegativeOutputTopicSubscriberId
      );

      let actualObservations: TestObservation[];

      if (theory.isExpectedPositive) {
        actualObservations = positiveObservations;
        expect(negativeObservations.length).to.equal(0);
      } else {
        actualObservations = negativeObservations;
        expect(positiveObservations.length).to.equal(0);
      }

      expect(actualObservations.length).to.be.greaterThan(0);

      const actualEventRecords = TestObservation.getEventRecords<
        SNSEvent,
        SNSEventRecord
      >(actualObservations);

      const actualEvent = JSON.parse(actualEventRecords[0].Sns.Message);
      expect(actualEvent).to.deep.equal(testEvent);
    });
  });
});
