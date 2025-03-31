<?php

namespace App\Imports;

use App\Models\Asset;
use App\Models\Employee;
use App\Models\AssetDetail;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class AssetsImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        // Find the employee by name or create a new one
        $employee = Employee::firstOrCreate([
            'EMPLOYEENAME' => $row['employee_name'],
        ], [
            'DEPARTMENT' => $row['department'] ?? null,
            'LOCATION' => $row['location'] ?? null,
            'WORKSTATION' => $row['workstation'] ?? null,
        ]);

        // Find or create the asset
        $asset = Asset::firstOrCreate([
            'ASSETSID' => $row['asset_id'],
        ], [
            'EMPLOYEEID' => $employee->EMPNO,
        ]);

        // Insert asset details
        if (!empty($row['serial_number'])) {
            AssetDetail::updateOrCreate([
                'SYSTEMASSETID' => $row['system_asset_id'] ?? null,
            ], [
                'ASSETID' => $asset->ASSETSID,
                'MODEL' => $row['model'] ?? null,
                'SERIALNO' => $row['serial_number'] ?? null,
                'STATUS' => $row['status'] ?? null,
                'DATEISSUUED' => $row['issue_date'] ?? null,
                'CONDITIONS' => $row['condition'] ?? null,
            ]);
        }

        return null; // Returning null because we are handling relationships separately
    }
}
