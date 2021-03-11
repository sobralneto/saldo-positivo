<template>
	<div id="app">
		<nav class="navbar navbar-expand-lg navbar-dark bg-gradient bg-dark shadow">
			<div class="container">
				<a class="navbar-brand">Saldo Positivo</a>
				<div class="collapse navbar-collapse" id="navbarSupportedContent">
					<ul class="navbar-nav mr-auto">
						<li class="nav-item">
							<router-link class="nav-link" to="/">Lançamentos</router-link>
						</li>
						<li class="nav-item">
							<router-link class="nav-link" to="/charts">Gráficos</router-link>
						</li>
					</ul>
				</div>
			</div>
		</nav>
		<main class="container mt-4">
			<router-view />
		</main>
	</div>
</template>

<style lang="scss">
@import './styles/custom-bootstrap';
</style>
