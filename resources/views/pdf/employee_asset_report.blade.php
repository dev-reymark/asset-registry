<!DOCTYPE html>
<html>
<head>
    <title>{{ $employee->EMPLOYEENAME }}'s Asset Registry Information</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }

        /* Grid container for cards */
        .card-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* Auto-adjust columns */
            gap: 15px; /* Reduced gap for a tighter layout */
            padding: 15px;
        }

        .asset-box {
            display: flex; /* Align QR code and details horizontally */
            align-items: center;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: #f9f9f9;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            padding: 12px; /* Reduced padding for a compact look */
            height: 120px;
            transition: transform 0.2s ease, box-shadow 0.2s ease; /* Smooth hover effect */
        }

        .asset-box:hover {
            transform: translateY(-5px); /* Subtle hover effect */
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        }

        .qr-code {
            margin-right: 15px;
            flex-shrink: 0; /* Prevent QR code from shrinking */
        }

        .qr-code img {
            width: 60px;
            height: 60px;
            object-fit: contain;
        }

        .details {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 100%;
        }

        .details p {
            margin: 3px 0;
            font-size: 12px; /* Maintain compact text */
        }

        .details strong {
            font-weight: bold;
            font-size: 13px; /* Slightly larger font for emphasis */
        }

        /* Title styling */
        h2 {
            font-size: 22px;
            margin-bottom: 20px;
        }

        /* No assets message */
        .no-assets {
            font-size: 16px;
            font-weight: 500;
            color: #555;
        }
    </style>
</head>
<body>
    <h2>{{ $employee->EMPLOYEENAME }}</h2>

    @if(count($employee->assets) > 0)
        <div class="card-container">
            @foreach($employee->assets as $asset)
                @foreach ($asset->assetDetails as $detail)
                    <!-- Card for Each Asset -->
                    <div class="asset-box">
                        <!-- QR Code Section -->
                        <div class="qr-code">
                            <img src="{{ $detail->qr_code ?? '#' }}" alt="QR Code">
                        </div>

                        <!-- Asset Details Section -->
                        <div class="details">
                            <p>{{ $detail->DESCRIPTION ?? '--' }}</p>
                            <p>{{ $detail->MODEL ?? '--' }}</p>
                            <p><strong>SN:</strong> {{ $detail->SERIALNO ?? '--' }}</p>
                            <p><strong>Issued To:</strong> {{ $detail->ISSUEDTO ?? '--' }}</p>
                            <p><strong>Date Issued:</strong> {{ $detail->DATEISSUED ?? '--' }}</p>
                        </div>
                    </div>
                @endforeach
            @endforeach
        </div>
    @else
        <p class="no-assets">No active assets assigned to this employee.</p>
    @endif
</body>
</html>
