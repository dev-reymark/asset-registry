export default function ApplicationLogo({ className = "" }) {
    return (
        <img
            src="/assets/img/dsc-logo.png"
            alt="DSC Logo"
            className={`block h-14 w-auto ${className}`}
        />
    );
}
