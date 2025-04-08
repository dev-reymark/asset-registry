<?php

namespace App\Imports;

use App\Models\Asset;
use App\Models\Employee;
use App\Models\AssetDetail;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class AssetsImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        // Log the incoming row data for debugging
        Log::info('Importing row:', $row);

        // Find or create the employee based on the employee name
        $employee = Employee::firstOrCreate(
            ['EMPLOYEENAME' => $row['employee_name']],
            [
                'DEPARTMENT' => $row['department'] ?? null,
                'LOCATION'   => $row['location'] ?? null,
                'WORKSTATION' => $row['workstation'] ?? null,
            ]
        );

        // Find or create the asset using the asset ID
        $asset = Asset::firstOrCreate(
            ['ASSETSID' => $row['asset_id']],
            ['EMPLOYEEID' => $employee->EMPNO]
        );

        // Check if there is any serial number and insert or update asset details
        if (!empty($row['serial_number'])) {
            AssetDetail::updateOrCreate(
                ['SYSTEMASSETID' => $row['system_asset_id'] ?? ''], // Ensure this is never null
                [
                    'ASSETID'       => $asset->ASSETSID,
                    'MODEL'         => $row['model'] ?? null,
                    'SERIALNO'      => $row['serial_number'] ?? null,
                    'STATUS'        => $row['status'] ?? null,
                    'DATEISSUUED'   => $this->parseDate($row['issue_date'] ?? null),
                    'CONDITIONS'    => $row['condition'] ?? null,
                ]
            );
        }

        return null; // Return null since we're not directly creating any records here
    }

    /**
     * Parse the issue date into a proper format (optional)
     */
    private function parseDate($date)
    {
        if (empty($date)) {
            return null;
        }

        // Handle Excel date format
        if (is_numeric($date)) {
            // Convert Excel serial date to Carbon
            return Carbon::createFromFormat('Y-m-d', \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($date)->format('Y-m-d'));
        }

        return Carbon::parse($date)->format('Y-m-d');
    }
}
