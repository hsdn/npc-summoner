module.exports = function NpcSummoner(mod) {
	const path = require("path");
	let zoneHw = false;

	mod.dispatch.addDefinition("C_REQUEST_CONTRACT", 50, path.join(__dirname, "C_REQUEST_CONTRACT.50.def"));

	Object.keys(mod.settings.npc).forEach(name => {
		mod.command.add(name, () => {
			const npc = mod.settings.npc[name];
			const buffer = Buffer.alloc(4);

			buffer.writeUInt32LE(npc.value);
			mod.send("C_REQUEST_CONTRACT", 50, {
				type: npc.type,
				target: npc.id,
				value: npc.value,
				name: "",
				data: buffer
			});
		});
	});

	mod.command.add("broker", () =>
		mod.toClient("S_NPC_MENU_SELECT", 1, { type: 28 })
	);

	mod.hook("S_LOAD_TOPO", 3, event => {
		zoneHw = event.zone === 7031;
	});

	mod.hook("S_SPAWN_NPC", 12, packet => {
		if (zoneHw) {
			const npc = Object.values(mod.settings.npc).find(e => e.templateId !== undefined && e.templateId === packet.templateId);

			if (npc) {
				npc.id = parseInt(packet.gameId);
			}
		}
	});

	this.destructor = () => {
		zoneHw = false;
		mod.command.remove(["broker", ...Object.keys(mod.settings.npc)]);
	};
};