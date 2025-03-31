<!DOCTYPE html>
<html>
<head>
    <title>{{ $employee->EMPLOYEENAME }}'s Asset Report</title>
</head>
<body>
    <h2>{{ $employee->EMPLOYEENAME }}'s Asset Report</h2>
    <p>{{ now()->format('Y-m-d') }}</p>

    @if(count($employee->assets) > 0)
        @foreach($employee->assets as $asset)
            <div class="asset-box">
                <div class="qr-code">
                    <img src="{{ $asset->qr_code ?? '#' }}" alt="QR Code">
                </div>
                <div class="details">
                    <p><strong>Asset ID:</strong> {{ $asset->ASSETSID ?? 'N/A' }}</p>
                    <p><strong>Assigned Employee:</strong> {{ $employee->EMPLOYEENAME }}</p>
@if (!empty($asset->assetDetails))
    @foreach ($asset->assetDetails as $detail)

        <hr>
        <p><strong>Asset Number:</strong> {{ $detail->ASSETNO ?? 'N/A' }}</p>
        <p><strong>Description:</strong> {{ $detail->DESCRIPTION ?? 'N/A' }}</p>
        <p><strong>Model:</strong> {{ $detail->MODEL ?? 'N/A' }}</p>
        <p><strong>Serial Number:</strong> {{ $detail->SERIALNO ?? 'N/A' }}</p>
        <p><strong>Issued To:</strong> {{ $detail->ISSUEDTO ?? 'N/A' }}</p>
        <p><strong>System Asset ID:</strong> {{ $detail->SYSTEMASSETID ?? 'N/A' }}</p>
        <p><strong>Date Issued:</strong> {{ $detail->DATEISSUUED ?? 'N/A' }}</p>
        <p><strong>Condition:</strong> {{ $detail->CONDITIONS ?? 'N/A' }}</p>
    @endforeach
@else
    <p>No asset details available.</p>
@endif

                </div>
            </div>
        @endforeach
    @else
        <p>No assets assigned to this employee.</p>
    @endif
</body>
</html>
