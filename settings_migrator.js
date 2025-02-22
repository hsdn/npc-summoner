/* eslint-disable no-param-reassign */
"use strict";

const DefaultSettings = {
	"npc": {
		// For bank NPC.
		// The "type" is a "type" from S_REQUEST_CONTRACT packet.
		// The "value" is a "container" from S_VIEW_WARE_EX packet.
		"bank": {
			"type": 26,
			"value": 1
		},
		"gbank": {
			"type": 26,
			"value": 3
		},
		"pbank": {
			"type": 26,
			"value": 9
		},
		"cbank": {
			"type": 26,
			"value": 12
		},
		// For other NPCs.
		// You can use "npcsummoner" command to enable debug for get values.
		"store": {
			"type": 9,
			"value": null,
			"gameId": null,
			"opts": [
				{ "templateId": 2019, "huntingZoneId": 183, "_value": 70310 },
				{ "templateId": 2022, "huntingZoneId": 58, "_value": 58001 },
				{ "templateId": 5001, "huntingZoneId": 13, "_value": 16091 },
				{ "templateId": 5101, "huntingZoneId": 13, "_value": 16092 },
				{ "templateId": 5201, "huntingZoneId": 13, "_value": 16092 },
				{ "templateId": 5301, "huntingZoneId": 13, "_value": 16092 },
				{ "templateId": 1015, "huntingZoneId": 3051, "_value": 2851665 },
				{ "templateId": 1037, "huntingZoneId": 3051, "_value": 2851665 },
				{ "templateId": 1222, "huntingZoneId": 3051, "_value": 2851665 },
				{ "templateId": 1303, "huntingZoneId": 3051, "_value": 2851665 },
				{ "templateId": 1408, "huntingZoneId": 3051, "_value": 16094 }
			]
		},
		"sstore": {
			"type": 9,
			"value": null,
			"gameId": null,
			"opts": [
				{ "templateId": 2109, "huntingZoneId": 183, "_value": 250 },
				{ "templateId": 2010, "huntingZoneId": 58, "_value": 58002 },
				{ "templateId": 1385, "huntingZoneId": 3051, "_value": 58002 }
			]
		},
		"bel": {
			"type": 50,
			"value": null,
			"gameId": null,
			"opts": [
				{ "templateId": 2045, "huntingZoneId": 183, "_value": 141 },
				{ "templateId": 2036, "huntingZoneId": 58, "_value": 141 },
				{ "templateId": 1414, "huntingZoneId": 3051, "_value": 141 }
			]
		},
		"vg": {
			"type": 49,
			"value": null,
			"gameId": null,
			"opts": [
				{ "templateId": 2058, "huntingZoneId": 183, "_value": 609 },
				{ "templateId": 2009, "huntingZoneId": 58, "_value": 609 },
				{ "templateId": 1382, "huntingZoneId": 3051, "_value": 609 }
			]
		}
	}
};

// Settings Migrator Extended v2.1
module.exports = function MigrateSettings(from_ver, to_ver, settings) {
	if (from_ver === undefined) return { ...DefaultSettings, ...settings };
	else if (from_ver === null) return DefaultSettings;
	else {
		from_ver = Number(from_ver);
		to_ver = Number(to_ver);

		if (from_ver + 1 < to_ver) {
			settings = MigrateSettings(from_ver, from_ver + 1, settings);
			return MigrateSettings(from_ver + 1, to_ver, settings);
		}

		const oldsettings = settings;
		settings = Object.assign(DefaultSettings, {});

		for (const option in oldsettings) {
			if (settings[option] !== undefined) {
				settings[option] = MigrateOption(settings[option], oldsettings[option], ["value", "gameId"]);
			}
		}

		return settings;
	}
};

function MigrateOption(option, oldoption, excludes = []) {
	if (oldoption === undefined) {
		oldoption = option;
	}

	if (Array.isArray(option)) {
		for (const key of Object.keys(option)) {
			option[key] = MigrateOption(option[key], oldoption[key], excludes);
		}
	} else if (option !== null && Object.getPrototypeOf(option) === Object.prototype) {
		for (const key of Object.keys(option)) {
			if (excludes.includes(key)) {
				option[key] = oldoption[key] || null;
			} else {
				option[key] = MigrateOption(option[key], oldoption[key], excludes);
			}
		}
	} else {
		option = oldoption;
	}

	return option;
}