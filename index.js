/* global ngapp, xelib */
let doesntUseSpellList = function(record) {
    if (!xelib.HasElement(record, 'ACBS\\Template Flags')) return;
    return !xelib.GetFlag(record, 'ACBS\\Template Flags', 'Use Spell List');
};

let HasPerk = function(record, perk) {
    return xelib.HasArrayItem(record, 'Perks', 'Perk', perk);
};

let AddPerk = function(record, perk, rank) {
    let newPerk = xelib.AddArrayItem(record, 'Perks', 'Perk', perk);
    xelib.SetValue(newPerk, 'Rank', rank);
};

registerPatcher({
    info: info,
    gameModes: [xelib.gmTES5, xelib.gmSSE],
    settings: {
        label: 'NPC Enchant Fix'
    },
    execute: {
        initialize: function(plugin, helpers, settings, locals) {
            locals.perks = {
                'AlchemySkillBoosts': '000A725C',
                'PerkSkillBoosts': '000CF788'
            };
        },
        process: [{
            load: () => ({
                signature: 'NPC_',
                filter: doesntUseSpellList
            }),
            patch: function(record, helpers, settings, locals) {
                helpers.logMessage(`Patching ${xelib.LongName(record)}`);
                Object.keys(locals.perks).forEach(key => {
                    let fid = locals.perks[key];
                    if (HasPerk(record, fid)) return;
                    AddPerk(record, fid, '1');
                });
            }
        }]
    }
});
