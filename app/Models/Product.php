<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $table = 'products';

    protected $primaryKey = 'PRODUCTID';

    public $timestamps = false;

    protected $fillable = [
        'PRODUCTID',
        'DESCRIPTION',
        'ASSETTYPE',
        'ASSETCOMPONENT',
    ];

    // Relationship with AssetType
    public function assetType()
    {
        return $this->belongsTo(AssetType::class, 'ASSETTYPE', 'ASSETTYPEID');
    }

    // Relationship with AssetComponent
    public function assetComponent()
    {
        return $this->belongsTo(AssetComponent::class, 'ASSETCOMPONENT', 'ASSETCOMPNETID');
    }

    public function assetComponents()
    {
        return $this->belongsToMany(AssetComponent::class, 'product_asset_component', 'PRODUCTID', 'ASSETCOMPNETID');
    }
}
