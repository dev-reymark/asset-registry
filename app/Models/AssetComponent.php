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
}
