<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asset extends Model
{
    use HasFactory;

    protected $table = 'Assets';
    protected $primaryKey = 'ASSETSID';
    public $timestamps = false;

    protected $fillable = [
        'EMPLOYEEID',
        'EMPLOYEENAME',
    ];

    // Relationship with Employee
    public function employee()
    {
        return $this->belongsTo(Employee::class, 'EMPLOYEEID', 'EMPNO');
    }

    // Relationship with AssetDetails
    public function assetDetails()
    {
        return $this->hasMany(AssetDetail::class, 'ASSETID', 'ASSETSID');
    }

    // Relationship with AssetType
    public function assetType()
    {
        return $this->belongsTo(AssetType::class, 'ASSETTYPEID', 'ASSETTYPEID');
    }

    // Relationship with AssetComponent
    public function assetComponents()
    {
        return $this->hasMany(AssetComponent::class, 'ASSETTYPEID', 'ASSETTYPEID');
    }
}
