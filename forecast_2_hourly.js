app.component('forecast_2_hourly', {

    data() {
        return {
            now: new Date(),
            timeslots: [],
            forecasts: {}
        };
    }, // data


    computed: {
        nowDate() {
            var nowStr = this.now.toISOString();
            return nowStr.slice(0, 10);
        }
    },

    created() {
        axios.get("https://api.data.gov.sg/v1/environment/2-hour-weather-forecast", {
            params: {
                date: this.nowDate
            }
        })
            .then(response => {
                var data = response.data;

                for (let i = 0; i < data.items.length; i++) {
                    let item = data.items[i];

                    let start = item.valid_period.start.substr(11, 5); 

                    let skip = false;
                    if ((i + 1) < data.items.length) {
                        let next_start = data.items[i + 1].valid_period.start.substr(11, 5);
                        if (start === next_start) continue; 
                    }

                    let end = item.valid_period.end.substr(11, 5);

                    this.timeslots.push({start:start,end:end});

                    for (let area_forecast of item.forecasts) {
                        let area = area_forecast.area;
                        let forecast = {
                            forecast: area_forecast.forecast,
                            skip: false,
                            span: 1 
                        };

                        if (forecast.forecast.includes("Partly Cloudy")) {
                            forecast.forecast = "Partly Cloudy";
                        }

                        if (this.forecasts[area]) {
                            this.forecasts[area].push(forecast);
                        } else {
                            this.forecasts[area] = [forecast];
                        }
                    }

                }

                this.timeslots.reverse();

                for (area in this.forecasts) {
                    this.forecasts[area].reverse();

                    let area_forecasts = this.forecasts[area];
                    for (let i = 0; i < area_forecasts.length; i++) {
                        let forecast_i = area_forecasts[i];

                        let j = i + 1;
                        while (j < area_forecasts.length
                            && forecast_i.forecast === area_forecasts[j].forecast) {

                            forecast_i.span++;
                            area_forecasts[j].skip = true;

                            j++;
                        }

                    }
                }

            })
            .catch(error => {
                document.getElementById("output").innerText = 'HTTP Error ' + error.message;
            });
    },

    template: `
        <!-- forecast_2_hourly: start -->
        <h1>Consolidated 2 hourly forecasts {{nowDate}}</h1>

        <div class="overflow-scroll" style="max-width: 100%; max-height:480px;">
            <table class="table table-bordered table-striped text-center">
                <thead>
                    <tr>
                        <th scope="col">Start of 2-hour </th>
                        <th scope='col' v-for='n in timeslots.length'>
                            {{timeslots[n-1].start}}
                            <template v-if="n===1">
                            to {{timeslots[n-1].end}}
                            </template>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(area_forecasts, area) in forecasts">
                        <th scope="row">{{area}}</th>
                        <template v-for="forecast in area_forecasts">
                            <td v-if="!forecast.skip" :colspan="forecast.span">
                                {{forecast.forecast}}
                            </td>
                        </template>
                    </tr>
                </tbody>
            </table>
        </div>

        <div id="output"></div>    
        <!-- forecast_2_hourly: end -->
    `
});
