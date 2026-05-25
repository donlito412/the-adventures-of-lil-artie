var AssetSlotMarker = pc.createScript('assetSlotMarker');

AssetSlotMarker.attributes.add('slotType', {
    type: 'string',
    default: 'character',
    enum: [
        { Character: 'character' },
        { Weapon: 'weapon' },
        { Environment: 'environment' },
        { Prop: 'prop' },
        { Audio: 'audio' },
        { UI: 'ui' }
    ]
});
AssetSlotMarker.attributes.add('assetName', { type: 'string', default: 'Unassigned' });
AssetSlotMarker.attributes.add('notes', { type: 'string', default: '' });

AssetSlotMarker.prototype.initialize = function () {
    this.entity.tags.add('asset-slot');
    this.entity.tags.add(this.slotType);
};
