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
        'ASSETNUMBER',
        'LOCATIONID'
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
        ArchivedAssetDetail::create([
            'asset_detail_id' => $this->ASSETNO,
            'archival_reason' => $reason,
            'status' => $status,
            'conditions' => $conditions,
        ]);

        $this->archived = true;
        $this->save();

        // Reorder active asset numbers
        self::reorderAssetNumbersForEmployee($this->EMPLOYEEID);
    }

    public function archivedDetail()
    {
        return $this->hasOne(ArchivedAssetDetail::class, 'asset_detail_id', 'ASSETNO');
    }

    protected static function booted()
    {
        static::creating(function ($asset) {
            $max = self::where('EMPLOYEEID', $asset->EMPLOYEEID)
                ->where('archived', false)
                ->max('ASSETNUMBER');

            $asset->ASSETNUMBER = $max ? $max + 1 : 1;
        });

        static::deleted(function ($asset) {
            // Reorder ASSETNUMBERs after deletion
            self::reorderAssetNumbersForEmployee($asset->EMPLOYEEID);
        });
    }

    protected static function reorderAssetNumbersForEmployee($employeeId)
    {
        $assets = self::where('EMPLOYEEID', $employeeId)
            ->where('archived', false)
            ->orderBy('ASSETNO')
            ->get();

        $i = 1;
        foreach ($assets as $asset) {
            $asset->ASSETNUMBER = $i++;
            $asset->save();
        }
    }

    public function location()
    {
        return $this->belongsTo(Location::class, 'LOCATIONID', 'LOCATIONID');
    }
}
