import { getCardDiv } from "../src/client/js/uiControl";

describe("uiControl", () => {
  describe("#getCardDiv", () => {
    beforeAll(() => {
      jest.useFakeTimers("modern").setSystemTime(new Date("2023-01-01"));
    });
    test("should create card div from trip", () => {
      const trip = {
        location: "Berlin",
        weather: {
          min_temp: 2,
          max_temp: 21,
          weather: [],
        },
        geo: {
          lng: 3,
          lat: 31,
        },
        start: "2023-01-02",
        end: "2023-01-03",
        days: 1,
      };
      expect(getCardDiv(trip)).toMatchInlineSnapshot(`
        <div
          class="card"
        >
          <div
            class="card-text"
          >
            <h3>
              Trip to Berlin (in 1 days)
            </h3>
            <h4>
              2023-01-02 - 2023-01-03 (2 days)
            </h4>
            <p>
              lng 3 lat 31
            </p>
            <p>
              2°C - 21°C
            </p>
          </div>
        </div>
      `);
    });
  });
});
