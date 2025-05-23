<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComponentDetail extends Model
{
    use HasFactory;

    protected $table = 'component_details';
    public $timestamps = false;

    protected $fillable = [
        'EMPLOYEEID',
        'PRODUCTID',
        'ASSETCOMPNETID',
        'COMPONENTNUMBER',
        'SYSTEMCOMPONENTID',
        'COMPONENTDESCRIPTION',
        'ASSETNO',
    ];

    /**
     * Automatically assign the next available COMPONENTNUMBER
     */
    protected static function booted()
    {
        static::creating(function ($component) {
            $max = self::where('EMPLOYEEID', $component->EMPLOYEEID)
                ->where('PRODUCTID', $component->PRODUCTID)
                ->max('COMPONENTNUMBER');

            $component->COMPONENTNUMBER = $max ? $max + 1 : 1;
        });
    }

    public function assetComponent()
    {
        return $this->belongsTo(AssetComponent::class, 'ASSETCOMPNETID', 'ASSETCOMPNETID');
    }
}
