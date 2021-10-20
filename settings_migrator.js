"use strict";

const DefaultSettings = {
	"npc": {
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
		"store": {
			"type": 9,
			"value": 70310,
			"id": null,
			"templateId": 2019
		},
		"sstore": {
			"type": 9,
			"value": 250,
			"id": null,
			"templateId": 2109
		},
		"vg": {
			"type": 49,
			"value": 609,
			"id": null,
			"templateId": 2058
		}
	}
};

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

		switch (to_ver) {
			default:
				settings = Object.assign(DefaultSettings, {});

				for (const option in oldsettings) {
					if (settings[option] !== undefined) {
						settings[option] = MigrateOption(settings[option], oldsettings[option], ["id"]);
					}
				}
		}

		return settings;
	}
};

function MigrateOption(option, oldoption, excludes) {
	if (oldoption === undefined) {
		oldoption = option;
	}

	if (Array.isArray(option)) {
		for (const key of Object.keys(option)) {
			option[key] = MigrateOption(option[key], oldoption[key], excludes);
		}
	}

	if (Object.getPrototypeOf(option) === Object.prototype) {
		option = { ...option, ...oldoption };

		for (const key of Object.keys(option)) {
			if (excludes.includes(key)) {
				option[key] = oldoption[key] || null;
			} else {
				option[key] = MigrateOption(option[key], oldoption[key], excludes);
			}
		}
	}

	return option;
}