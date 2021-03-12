<script>
import { Doughnut, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;
export default {
	extends: Doughnut,
	mixins: [reactiveProp],
	name: 'Chart',
	props: ['chartdata', 'options'],
	mounted() {
		this.options = {
			responsive: true,
			legend: {
				position: 'top',
			},
			title: {
				display: false,
			},
			animation: {
				animateScale: true,
				animateRotate: true,
			},
		};

		this.chartdata = {
			labels: ['Moradia', 'Carro'],
			datasets: [
				{
					data: [Math.round(Math.random() * 100), Math.round(Math.random() * 100)],
					backgroundColor: ['rgb(75, 192, 192)', 'rgb(255, 99, 132)'],
					label: '',
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
