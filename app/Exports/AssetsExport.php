<?php

namespace App\Exports;

use App\Models\Employee;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class AssetsExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        // Get employees with their assets and asset details
        $employees = Employee::active()->with(['assets.assetDetails', 'department', 'location', 'workstation'])->get();
        Log::info('Employees retrieved:', $employees->toArray());

        $data = [];

        foreach ($employees as $employee) {
            foreach ($employee->assets as $asset) {
                foreach ($asset->assetDetails as $detail) {
                    $data[] = [
                        'Employee Name'   => $employee->EMPLOYEENAME,
                        'Department'      => $employee->department->DEPARTMENTNAME ?? '--',
                        'Location'        => $employee->location->LOCATIONNAME ?? '--',
                        'Workstation'     => $employee->workstation->WORKSTATION ?? '--',
                        'Asset ID'        => $asset->ASSETSID,
                        'Description'     => $detail->DESCRIPTION ?? '--',
                        'Model'           => $detail->MODEL ?? '--',
                        'Serial Number'   => $detail->SERIALNO ?? '--',
                        'Status'          => $detail->STATUS ?? '--',
                        'Issue Date'      => $detail->DATEISSUUED ?? '--',
                        'Condition'       => $detail->CONDITIONS ?? '--',
                        'System Asset ID' => $detail->SYSTEMASSETID ?? '--',
                    ];
                }
            }
        }

        return collect($data);
    }

    public function headings(): array
    {
        return [
            'Employee Name',
            'Department',
            'Location',
            'Workstation',
            'Asset ID',
            'Description',
            'Model',
            'Serial Number',
            'Status',
            'Issue Date',
            'Condition',
            'System Asset ID'
        ];
    }
}
