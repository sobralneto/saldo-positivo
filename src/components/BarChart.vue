<script>
import { Bar, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;
export default {
	extends: Bar,
	mixins: [reactiveProp],
	name: 'Chart',
	props: ['chartdata', 'options'],
	mounted() {
		this.chartdata = {
			labels: [this.getRandomInt(), this.getRandomInt()],
			datasets: [
				{
					label: 'Receita',
					backgroundColor: 'rgb(75, 192, 192)',
					data: [this.getRandomInt(), this.getRandomInt()],
				},
				{
					label: 'Despesa',
					backgroundColor: 'rgb(255, 99, 132)',
					data: [this.getRandomInt(), this.getRandomInt()],
				},
			],
		};
		this.renderChart(this.chartdata, this.options);
	},
	methods: {
		getRandomInt() {
			return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
		},
	},
};
</script>

<style></style>
