<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssetType extends Model
{
    use HasFactory;

    protected $table = 'AssetType';
    protected $primaryKey = 'ASSETTYPEID';
    public $timestamps = false;

    protected $fillable = [
        'ASSETTYPEID',
        'ASSETTYPE',
    ];

    public function products()
    {
        return $this->hasMany(Product::class, 'ASSETTYPE', 'ASSETTYPEID');
    }

    public function assetComponents()
    {
        return $this->hasMany(AssetComponent::class, 'ASSETTYPEID', 'ASSETTYPEID');
    }
}
