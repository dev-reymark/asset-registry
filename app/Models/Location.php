<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

    protected $table = 'Location';
    protected $primaryKey = 'LOCATIONID';

    public $timestamps = false;

    protected $fillable = [
        'LOCATIONID',
        'LOCATIONNAME',
        'DEPARTMETID',
    ];

    // Relationship to Department
    public function department()
    {
        return $this->belongsTo(Department::class, 'DEPARTMETID', 'DEPARTMETID');
    }
}
