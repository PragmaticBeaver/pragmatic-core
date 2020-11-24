import { EventBus } from "./event-bus";

describe("EventBus", async () => {
  it("should add subscriber", async () => {
    const sut = new EventBus();
    const topic = "testTopic";

    const result = sut.subscribe(topic, async () => {
      console.log("hello test");
    });

    expect(result).toBeDefined();
    expect(result.Id).toBeDefined();
  });

  it("should remove subscriber", async () => {
    const sut = new EventBus();
    const topic = "testTopic";

    const token = sut.subscribe(topic, async () => {
      throw new Error("i should not be called!");
    });
    sut.unsubscribe(token);

    await sut.publish(topic);
  });

  it("should only remove specified subscriber", async () => {
    const sut = new EventBus();
    const topic = "testTopic";

    const token = sut.subscribe(topic, async () => {
      throw new Error("i should not be called!");
    });

    let wasCalled = false;
    sut.subscribe(topic, async () => {
      wasCalled = true;
    });

    sut.unsubscribe(token);
    await sut.publish(topic);

    expect(wasCalled).toBeTruthy();
  });

  it("should call subscriber callback", async () => {
    const sut = new EventBus();
    const topic = "testTopic";

    let wasCalled = false;
    sut.subscribe(topic, async () => {
      wasCalled = true;
    });

    await sut.publish(topic);

    expect(wasCalled).toBeTruthy();
  });

  it("should call every subscriber callback", async () => {
    const sut = new EventBus();
    const topic = "testTopic";

    let firstCbWasCalled = false;
    sut.subscribe(topic, async () => {
      firstCbWasCalled = true;
    });
    let secondCbWasCalled = false;
    sut.subscribe(topic, async () => {
      secondCbWasCalled = true;
    });
    let thirdCbWasCalled = false;
    sut.subscribe(topic, async () => {
      thirdCbWasCalled = true;
    });

    await sut.publish(topic);

    expect(firstCbWasCalled).toBeTruthy();
    expect(secondCbWasCalled).toBeTruthy();
    expect(thirdCbWasCalled).toBeTruthy();
  });

  it("should sort subscriber depending on placeInOrder", async () => {
    const sut = new EventBus();
    const topic = "testTopic";
    const firstSubscribedId = "firstSub";
    const lastSubscribedId = "lastSub";

    const calls: string[] = [];
    sut.subscribe(
      topic,
      async () => {
        calls.push(firstSubscribedId);
      },
      200
    );

    sut.subscribe(
      topic,
      async () => {
        calls.push(lastSubscribedId);
      },
      100
    );

    await sut.publish(topic);

    const secondResult = calls.pop();
    const firstResult = calls.pop();

    expect(firstResult).toBeDefined();
    expect(firstResult).toEqual(lastSubscribedId);

    expect(secondResult).toBeDefined();
    expect(secondResult).toEqual(firstSubscribedId);
  });

  it("should publish args to subscriber", async () => {
    const sut = new EventBus();
    const topic = "testTopic";

    type TestObj = {
      id: string;
      val: {
        name: string;
        sirname: string;
      };
    };

    let wasCalled = false;
    let resultingArgs;
    sut.subscribe(topic, async (obj: TestObj) => {
      wasCalled = true;
      resultingArgs = obj;
    });

    const testData: TestObj = {
      id: "testId",
      val: {
        name: "theTest",
        sirname: "ofTestingHouse",
      },
    };
    await sut.publish(topic, testData);

    expect(wasCalled).toBeTruthy();

    expect(resultingArgs).toBeDefined();
    expect(resultingArgs).not.toBeNull();
    expect(resultingArgs).toEqual(testData);
  });
});
