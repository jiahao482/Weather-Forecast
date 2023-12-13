app.component('forecast_4_days', {
    data() {
        return {
            now: new Date(),
            forecasts: []
        };
    }, 

    computed: {
        nowDate() {
            var nowStr = this.now.toISOString();
            return nowStr.slice(0, 10);
        }
    }, 


    created() {
        axios.get("https://api.data.gov.sg/v1/environment/4-day-weather-forecast", {
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

            this.forecasts = obj.items[obj.items.length - 1].forecasts;


        } 
    }, 

    template: `

        <!-- forecast_4_days: start -->
        <h2>4-days</h2>

        <table class='table table-bordered table-striped text-center'>
            <thead>
                <tr>
                    <th scope="col" rowspan='2'>Date</th>
                    <th scope="col" rowspan='2'>Forecast</th>
                    <th scope="col" colspan='2'>Temperature</th>
                    <th scope="col" colspan='2'>Humid</th>
                    <th scope="col" colspan='3'>Wind</th>
                </tr>
                <tr>
                    <td>Low</td>
                    <td>High</td>
                    <td>Low</td>
                    <td>High</td>
                    <td>Direction</td>
                    <td>Low</td>
                    <td>High</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="forecast of forecasts">
                    <th scope='row'>{{forecast.date}}</th>
                    <td>{{forecast.forecast}}</td>
                    <td>{{forecast.temperature.low}}</td>
                    <td>{{forecast.temperature.high}}</td>
                    <td>{{forecast.relative_humidity.low}}</td>
                    <td>{{forecast.relative_humidity.high}}</td>
                    <td>{{forecast.wind.direction}}</td>
                    <td>{{forecast.wind.speed.low}}</td>
                    <td>{{forecast.wind.speed.high}}</td>
                </tr>


            </tbody>
        </table>

        <p id="output"></p>    
        <!-- forecast_4_days: end -->
    `
});
