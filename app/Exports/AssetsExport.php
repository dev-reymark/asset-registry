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
        $employees = Employee::with(['assets.assetDetails'])->get();

        if ($employees->isEmpty()) {
            Log::info('No employees or assets found');
        } else {
            Log::info('Employees retrieved:', $employees->toArray());
        }

        $data = [];

        foreach ($employees as $employee) {
            foreach ($employee->assets as $asset) {
                foreach ($asset->assetDetails as $detail) {
                    $data[] = [
                        'Employee Name'   => $employee->EMPLOYEENAME,
                        'Department'      => $employee->DEPARTMENT ?? 'N/A',
                        'Location'        => $employee->LOCATION ?? 'N/A',
                        'Workstation'     => $employee->WORKSTATION ?? 'N/A',
                        'Asset ID'        => $asset->ASSETSID,
                        'Asset Name'      => $asset->name ?? 'N/A',
                        'Model'           => $detail->MODEL ?? 'N/A',
                        'Serial Number'   => $detail->SERIALNO ?? 'N/A',
                        'Status'          => $detail->STATUS ?? 'N/A',
                        'Issue Date'      => $detail->DATEISSUUED ?? 'N/A',
                        'Condition'       => $detail->CONDITIONS ?? 'N/A',
                        'System Asset ID' => $detail->SYSTEMASSETID ?? 'N/A',
                    ];
                }

                // If an asset has no details, still include it
                if ($asset->assetDetails->isEmpty()) {
                    $data[] = [
                        'Employee Name'   => $employee->EMPLOYEENAME,
                        'Department'      => $employee->DEPARTMENT ?? 'N/A',
                        'Location'        => $employee->LOCATION ?? 'N/A',
                        'Workstation'     => $employee->WORKSTATION ?? 'N/A',
                        'Asset ID'        => $asset->ASSETSID,
                        'Asset Name'      => $asset->name ?? 'N/A',
                        'Model'           => 'N/A',
                        'Serial Number'   => 'N/A',
                        'Status'          => 'N/A',
                        'Issue Date'      => 'N/A',
                        'Condition'       => 'N/A',
                        'System Asset ID' => 'N/A',
                    ];
                }
            }

            // If an employee has no assets, still include them
            if ($employee->assets->isEmpty()) {
                $data[] = [
                    'Employee Name'   => $employee->EMPLOYEENAME,
                    'Department'      => $employee->DEPARTMENT ?? 'N/A',
                    'Location'        => $employee->LOCATION ?? 'N/A',
                    'Workstation'     => $employee->WORKSTATION ?? 'N/A',
                    'Asset ID'        => 'N/A',
                    'Asset Name'      => 'N/A',
                    'Model'           => 'N/A',
                    'Serial Number'   => 'N/A',
                    'Status'          => 'N/A',
                    'Issue Date'      => 'N/A',
                    'Condition'       => 'N/A',
                    'System Asset ID' => 'N/A',
                ];
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
            'Asset Name',
            'Model',
            'Serial Number',
            'Status',
            'Issue Date',
            'Condition',
            'System Asset ID'
        ];
    }
}
