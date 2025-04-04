<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssetComponent extends Model
{
    use HasFactory;

    protected $table = 'AssetComponents';
    protected $primaryKey = 'ASSETCOMPNETID';
    public $timestamps = false;

    protected $fillable = [
        'ASSETCOMPNETID',
        'ASSETCOMPONENTNAME',
        'ASSETTYPEID',
    ];

    public function products()
    {
        return $this->hasMany(Product::class, 'ASSETCOMPONENT', 'ASSETCOMPNETID');
    }

    public function assetType()
    {
        return $this->belongsTo(AssetType::class, 'ASSETTYPEID', 'ASSETTYPEID');
    }
}
