export default class ArtyomCommandsManager {
    constructor(ArtyomInstance) {
      this._artyom = ArtyomInstance;
    }
  
    loadCommands() {
      let Artyom = this._artyom;
  
      return Artyom.addCommands([
        {
          indexes: ["Hello", "Hi"],
          action: () => {
            console.log("Command recognized: Hello or Hi"); // Debugging
            Artyom.say("Hello, how can I help you?");
          }
        },
        {
          indexes: ["search bus stops"],
          action: () => {
            Artyom.say("Fetching available bus stops...");
            fetch("http://localhost:3001/BusStops")
              .then(response => response.json())
              .then(data => {
                const stops = data.join(", "); // Assuming data is already in JSON format
                console.log("Bus stops data:", stops); // Debugging
                Artyom.say(`The available bus stops are: ${stops}`);
              })
              .catch(err => {
                console.error("Error fetching bus stops:", err);
                Artyom.say("I'm sorry, there was an error fetching bus stops.");
              });
          }
        },
        {
          indexes: ["show route IDs"],
            action: () => {
              console.log("Command recognized: show route IDs"); // Logs when command is recognized
              
              Artyom.say("Retrieving available route IDs...");
              
              fetch("http://localhost:3001/RouteId")
                .then(response => {
                  console.log("Fetch response status:", response.status); // Log response status
                  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                  return response.json();
                })
                .then(data => {
                  if (!Array.isArray(data)) throw new Error("Expected an array in response data");
                  const routeIds = data.join(", ");
                  console.log("Route IDs data:", routeIds); // Logs the fetched data
                  window.speechSynthesis.cancel();
                  Artyom.say(`The available route IDs are: ${routeIds}`);
                })
                .catch(err => {
                  console.error("Error fetching route IDs:", err);
                  window.speechSynthesis.cancel();
                  Artyom.say("I'm sorry, there was an error retrieving route IDs.");
                });
            }

        },
        {
          indexes: ["fetch buses for route *"],
          smart: true,
          action: (i, routeID) => {
            Artyom.say(`Fetching buses for route ID ${routeID}`);
            fetch(`http://localhost:3001/fetchBuses/${routeID}`)
              .then(response => response.json())
              .then(data => {
                if (data.error) {
                  console.log("Fetch buses error:", data.error); // Debugging
                  Artyom.say(data.error);
                } else {
                  const busInfo = data.map(bus => `Bus ${bus.BusRegnNo} at ${bus.StartTime} with ${bus.ReservedSeats} reserved seats`).join(". ");
                  console.log("Bus information:", busInfo); // Debugging
                  Artyom.say(`Buses for route ${routeID}: ${busInfo}`);
                }
              })
              .catch(err => {
                console.error("Error fetching buses:", err);
                Artyom.say("Sorry, I couldn't fetch buses for that route.");
              });
          }
        },
        {
          indexes: ["show agencies"],
          action: () => {
            Artyom.say("Fetching bus agencies...");
            fetch("http://localhost:3001/Agencies")
              .then(response => response.json())
              .then(data => {
                const agencies = data.join(", "); // Assuming data is already in JSON format
                console.log("Agencies data:", agencies); // Debugging
                Artyom.say(`The available agencies are: ${agencies}`);
              })
              .catch(err => {
                console.error("Error fetching agencies:", err);
                Artyom.say("Sorry, I couldn't retrieve the agencies.");
              });
          }
        },
        {
          indexes: ["get booked seats for bus * on *"],
          smart: true,
          action: (i, busRegNo, travelDate) => {
            Artyom.say(`Checking booked seats for bus ${busRegNo} on ${travelDate}`);
            fetch("http://localhost:3001/BookedSeats", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ busregnno: busRegNo, traveldate: travelDate })
            })
              .then(response => response.json())
              .then(data => {
                if (data.error) {
                  console.log("Booked seats error:", data.error); // Debugging
                  Artyom.say(data.error);
                } else {
                  const bookedSeats = data.join(", ");
                  console.log("Booked seats data:", bookedSeats); // Debugging
                  Artyom.say(`The booked seats for bus ${busRegNo} on ${travelDate} are: ${bookedSeats}`);
                }
              })
              .catch(err => {
                console.error("Error fetching booked seats:", err);
                Artyom.say("Sorry, I couldn't fetch booked seats for that bus.");
              });
          }
        }
      ]);
    }
  }
  