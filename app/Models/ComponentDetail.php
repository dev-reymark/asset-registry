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
        'ASSETCOMPONENTID',
        'COMPONENTNUMBER',
        'SYSTEMCOMPONENTID',
        'COMPONENTDESCRIPTION',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'PRODUCTID', 'PRODUCTID');
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'EMPLOYEEID', 'EMPLOYEEID');
    }

    public function assetComponent()
    {
        return $this->belongsTo(AssetComponent::class, 'ASSETCOMPONENTID', 'ASSETCOMPONENTID');
    }

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
}
