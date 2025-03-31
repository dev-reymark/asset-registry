<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DSC ASSETS REGISTRY INFORMATION</title>
    <style>
        body { font-family: Arial, sans-serif; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .qr-code { width: 100px; height: 100px; }
    </style>
</head>
<body>
    <h2>DSC ASSETS REGISTRY INFORMATION</h2>
    <table>
        <thead>
            <tr>
                <th>Asset ID</th>
                <th>Employee</th>
               
            </tr>
        </thead>
        <tbody>
            @foreach ($assets as $asset)
                <tr>
                    <td>{{ $asset->ASSETSID }}</td>
                    <td>{{ $asset->name }}</td>
                    <td>{{ $asset->employee ? $asset->employee->EMPLOYEENAME : 'Unassigned' }}</td>
                   
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
