<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssetDetail extends Model
{
    use HasFactory;

    protected $table = 'AssetDetails';
    protected $primaryKey = 'EMPLOYEEID';
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
        'WORKSTAION',
        'TYPESIZE',
        'NOPRINT',
        'COMPONENT',
        'WITHCOMPONENTS',
        'SYSTEMASSETID',
        'SYSTEMCOMPONENTID',
    ];

    /**
     * Define the relationship with Asset model.
     */
    public function asset()
    {
        return $this->belongsTo(Asset::class, 'ASSETID', 'ASSETSID');
    }
}
