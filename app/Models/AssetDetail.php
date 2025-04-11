<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssetDetail extends Model
{
    use HasFactory;

    protected $table = 'AssetDetails';
    protected $primaryKey = 'ASSETNO';
    public $timestamps = false;

    protected $fillable = [
        'EMPLOYEEID',
        'ASSETNO',
        'ASSETID',
        'PRODUCTID',
        'DESCRIPTION',
        'MODEL',
        'SERIALNO',
        'ISSUEDTO',
        'DATEISSUUED',
        'IMAGEPATH',
        'SERIALTYPE',
        'STATUS',
        'ASSETFROM',
        'CONDITIONS',
        'WORKSTATION',
        'TYPESIZE',
        'NOPRINT',
        'COMPONENT',
        'WITHCOMPONENTS',
        'SYSTEMASSETID',
        'SYSTEMCOMPONENTID',
        'archived',
    ];

    /**
     * Define the relationship with Asset model.
     */
    public function asset()
    {
        return $this->belongsTo(Asset::class, 'ASSETID', 'ASSETSID');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'PRODUCTID', 'PRODUCTID');
    }

    public function scopeArchived($query)
    {
        return $query->where('archived', true);
    }

    public function scopeActive($query)
    {
        return $query->where('archived', false);
    }

    /**
     * Archive the asset and store the archival details.
     */
    public function archive($reason, $status, $conditions)
    {
        // Store archival details
        ArchivedAssetDetail::create([
            'asset_detail_id' => $this->ASSETNO,
            'archival_reason' => $reason,
            'status' => $status,
            'conditions' => $conditions,
        ]);

        // Mark the asset as archived
        $this->archived = true;
        $this->save();
    }

    public function archivedDetail()
    {
        return $this->hasOne(ArchivedAssetDetail::class, 'asset_detail_id', 'ASSETNO');
    }
}
