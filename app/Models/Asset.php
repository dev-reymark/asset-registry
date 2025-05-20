<?php

namespace App\Models;

use App\Traits\LogsHistory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asset extends Model
{
    use HasFactory;
    use LogsHistory;

    protected $table = 'Assets';
    protected $primaryKey = 'ASSETSID';
    public $timestamps = false;

    protected $fillable = [
        // 'ASSETSID',
        'EMPLOYEEID',
        'EMPLOYEENAME',
        'archived',
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

    public function scopeArchived($query)
    {
        return $query->where('archived', true);
    }

    public function scopeActive($query)
    {
        return $query->where('archived', false);
    }

    public function location()
    {
        return $this->belongsTo(Location::class, 'LOCATIONID', 'LOCATIONID');
    }
}
