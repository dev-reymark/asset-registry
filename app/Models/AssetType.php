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
}
