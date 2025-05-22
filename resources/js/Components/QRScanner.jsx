import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRScanner = () => {
    const [scanResult, setScanResult] = useState(null);
    const scannerRef = useRef(null);

    const TARGET_IP = "https://172.16.13.215/";
    useEffect(() => {
        scannerRef.current = new Html5QrcodeScanner("reader", {
            fps: 10,
            qrbox: 250,
        });

        scannerRef.current.render(
            (result) => {
                setScanResult(result);

                try {
                    const url = new URL(result);
                    const redirectTo = `${TARGET_IP}${url.pathname}${url.search}${url.hash}`;
                    window.location.href = redirectTo;
                } catch (e) {
                    console.error("Invalid URL scanned:", e);
                }
            },
            (error) => {
                console.error("QR scanning error:", error);
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
                <p>Redirecting...</p>
            ) : (
                <div id="reader" style={{ width: "100%" }}></div>
            )}
        </div>
    );
};

export default QRScanner;
