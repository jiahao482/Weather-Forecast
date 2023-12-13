app.component('temperature', {
    data() {
        return {
            now: null,
            message: '',
            temperatureList: [],
        };
    },
    created() {
        this.getTemperature();
    }, 
    methods: {
        getTemperature() {
            this.now = new Date();
            var nowStr = this.now.toISOString();
            nowStr = nowStr.slice(0, nowStr.indexOf('.'));
            console.log(nowStr)

            let url = "https://api.data.gov.sg/v1/environment/air-temperature";
            axios.get(url, {
                params: {
                    date_time: nowStr
                }
            })
                .then(response => {
                    let obj = response.data;
                    let station_map = {};
                    for (station of obj.metadata.stations) {
                        station_map[station.id] = station.name;
                    }

                    this.temperatureList = [];
                    for (reading of obj.items[obj.items.length-1].readings) {

                        this.temperatureList.push({
                            'id': reading.station_id,
                            'station': station_map[reading.station_id],
                            'temperature': reading.value
                        });
                    }
                })
                .catch(error => {
                    this.message = 'HTTP Error ' + error.message;
                });
        }
    },

    template: `
        <!-- temperature: start -->    
        <h1>
            Singapore temperature
        </h1>

        <h2>
            {{ now.toLocaleString('en-GB', { timeZone: 'UTC' }) }}
            <button class='btn btn-primary' @click='getTemperature'>Refresh</button>
        </h2>

        <p class='text-danger' v-if='message.length > 0'>
            {{ message }}
        </p>


        <table class='table' v-if='temperatureList.length > 0'>
            <thead class='table-dark'>
                <tr>
                    <th scope='col'>Station</th>
                    <th scope='col'>Temperature</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for='item of temperatureList'>
                    <th scope='row'> {{ item.station }} </th>
                    <td> {{ item.temperature }} </td>
                </tr>
            </tbody>
        </table>
        <!-- temperature: end -->    
    `
});
