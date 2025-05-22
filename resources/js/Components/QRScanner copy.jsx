import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRScanner = () => {
    const [scanResult, setScanResult] = useState(null);
    const scannerRef = useRef(null);

    useEffect(() => {
        scannerRef.current = new Html5QrcodeScanner("reader", {
            fps: 10,
            qrbox: 250,
        });

        scannerRef.current.render(
            (result) => {
                setScanResult(result);
                alert(`QR Code Scanned: ${result}`);
                window.location.href = result; // Redirects to the scanned URL
            },
            (error) => {
                console.error(error);
            }
        );

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear();
            }
        };
    }, []);

    return (
        <div>
            {scanResult ? (
                <p>Redirecting to: {scanResult}</p>
            ) : (
                <div id="reader" style={{ width: "100%" }}></div>
            )}
        </div>
    );
};

export default QRScanner;
