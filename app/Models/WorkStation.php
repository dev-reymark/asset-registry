<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkStation extends Model
{
    use HasFactory;

    protected $table = 'WorkStation';

    protected $primaryKey = 'WORKSTATIONID';

    public $timestamps = false;

    protected $fillable = [
        'DEPARTMENTID',
        'WORKSTATIONID',
        'WORKSTATION',
        'LOCATIONID',
    ];

    // Relationship to Department
    public function department()
    {
        return $this->belongsTo(Department::class, 'DEPARTMENTID', 'DEPARTMETID');
    }

    // Relationship to Location
    public function location()
    {
        return $this->belongsTo(Location::class, 'LOCATIONID', 'LOCATIONID');
    }
}
