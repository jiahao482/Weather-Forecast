app.component('forecast_24_hour', {
    data() {
        return {
            now: new Date(),
            updateTimestamp: '',
            overall_forecast: '',
            parameters: [],
            period_details: []
        };
    }, 

    computed: {
        nowDate() {
            var nowStr = this.now.toISOString();
            return nowStr.slice(0, 10);
        }
    },


    created() {

        axios.get("https://api.data.gov.sg/v1/environment/24-hour-weather-forecast", {
            params: {
                date: this.nowDate
            }
        })
            .then(response => {
                var obj = response.data;
                this.process(obj);
            }).catch(error => {
                document.getElementById("output").innerText = 'HTTP Error ' + error.message;
            });
    }, 

    methods: {
        getTimePart(str) {
            return str.slice(11, 16);
        },

        process(obj) {

            let latestUpdate = obj.items[obj.items.length - 1];

            let general = latestUpdate.general;

            this.updateTimestamp = this.getTimePart(latestUpdate.timestamp);

            this.overall_forecast = general.forecast;

            this.parameters = [
                {
                    name: "Humidity",
                    low: general.relative_humidity.low,
                    high: general.relative_humidity.high
                },
                {
                    name: "Temperature",
                    low: general.temperature.low,
                    high: general.temperature.high
                },
                {
                    name: "Wind Speed(" + general.wind.direction + ")",
                    low: general.wind.speed.low,
                    high: general.wind.speed.high
                }
            ]


            let periods = latestUpdate.periods;
            for (period of periods) {
                this.period_details.push({
                    start: period.time.start,
                    end: period.time.end,
                    north: period.regions.north,
                    south: period.regions.south,
                    east: period.regions.east,
                    west: period.regions.west,
                    central: period.regions.central
                });
            }


        } 
    }, 

    template: `
        <!-- forecast_24_hour: start -->
        <h2 id="heading">24-hour dated {{nowDate}} {{updateTimestamp}}</h2>
        <h2 id="forecast">{{overall_forecast}}</h2>

        <table class='table table-bordered'>
            <thead>
                <tr>
                    <th scope="col"></th>
                    <th scope="col">Low</th>
                    <th scope="col">High</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="parameter of parameters">
                    <th scope='row'>{{parameter.name}}</th>
                    <td>{{parameter.low}}</td>
                    <td>{{parameter.high}}</td>
                </tr>
            </tbody>
        </table>

        <table class='table table-bordered'>
            <thead>
                <th scope="col">Start</th>
                <th scope="col">End</th>
                <th scope="col">North</th>
                <th scope="col">South</th>
                <th scope="col">East</th>
                <th scope="col">West</th>
                <th scope="col">Central</th>
            </thead>
            <tbody>
                <tr v-for="details of period_details">
                    <th scope='row'>{{details.start}}</th>
                    <th scope='row'>{{details.end}}</th>
                    <td>{{details.north}}</td>
                    <td>{{details.south}}</td>
                    <td>{{details.east}}</td>
                    <td>{{details.west}}</td>
                    <td>{{details.central}}</td>
                </tr>
            </tbody>
        </table>


        <p id="output"></p>
        <!-- forecast_24_hour: end -->

    `
});
