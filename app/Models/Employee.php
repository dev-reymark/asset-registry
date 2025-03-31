<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $table = 'Employee';
    protected $primaryKey = 'EMPNO';
    public $timestamps = false;

    protected $fillable = [
        'EMPNO',
        'EMPLOYEENAME',
        'DEPARTMENT',
        'LOCATION',
        'WORKSTATION',
    ];

    // Relationship to Department
    public function department()
    {
        return $this->belongsTo(Department::class, 'DEPARTMENT', 'DEPARTMETID');
    }

    // Relationship to Location
    public function location()
    {
        return $this->belongsTo(Location::class, 'LOCATION', 'LOCATIONID');
    }

    // Relationship to WorkStation
    public function workstation()
    {
        return $this->belongsTo(WorkStation::class, 'WORKSTATION', 'WORKSTATIONID');
    }

    /**
     * Get all assets assigned to the employee.
     */
    public function assets()
    {
        return $this->hasMany(Asset::class, 'EMPLOYEEID', 'EMPNO');
    }
}
