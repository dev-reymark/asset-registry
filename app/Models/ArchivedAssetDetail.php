<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ArchivedAssetDetail extends Model
{
    protected $table = 'archived_asset_details';

    protected $fillable = [
        'asset_detail_id',
        'archival_reason',
        'status',
        'conditions',
        'archived_at',
    ];

    /**
     * Define the relationship with the AssetDetail model.
     */
    public function assetDetail()
    {
        return $this->belongsTo(AssetDetail::class, 'asset_detail_id', 'ASSETNO');
    }
}
