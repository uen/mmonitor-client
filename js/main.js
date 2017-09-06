var servers = []

hostnames.forEach((server, key)=>{
	servers[key] = {name:server.name, hostname:server.hostname, cpu:0, memory:0, processes:0, cpuReal:0, memoryReal:0, cpuLerp:0, memoryLerp:0, lastUpdate:0, online:false, offline:true}

	var socket = io("http://"+server.hostname+":"+server.port)
	socket.on('connection', (client) => {
		console.log('Connection to '+server+" established")
	})

	socket.on('data', (serverData) => {
		servers[key].lastUpdate = Math.floor(new Date().getTime()/1000)
		servers[key].cpuReal = serverData.cpu
		servers[key].memoryReal = serverData.memory
		servers[key].processes = serverData.processes
		servers[key].lastUpdate = Math.floor(new Date().getTime()/1000)
		servers[key].online = true
		servers[key].offline = false
	})


})

var serverList = document.getElementById('servers')
rivets.bind(serverList, {servers:servers})

var lerp = (dt, from, to) => {
	return from+(to-from)*dt
}

var update = () => {
	servers.forEach((server, key) => {

		servers[key].cpuLerp = lerp(0.15, server.cpuLerp, server.cpuReal)
		servers[key].memoryLerp = lerp(0.15, server.memoryLerp, server.memoryReal)
		
		servers[key].cpu = server.cpuLerp.toFixed(0)
		servers[key].memory = server.memoryLerp.toFixed(0)
	});



	requestAnimationFrame(update)
}


requestAnimationFrame(update)


setInterval(() => {
	var time = Math.floor(new Date().getTime()/1000)
	servers.forEach((server, key) => {
		if(server.online && (server.lastUpdate+3 < time)){
			servers[key].online = false
			servers[key].offline = true

			servers[key].cpuReal = 0
			servers[key].memoryReal = 0
			servers[key].processes = 0
		}
	});
}, 1000)