export default function VersionDisplay({ version, buildDate }) {

    if (!version || version === "N/A") {
        return null;
    }

    let formattedDate = "Invalid Date";
    if (buildDate && buildDate !== "N/A") {
        try {
            const dateObject = new Date(buildDate);
            if (!isNaN(dateObject.getTime())) {
                formattedDate = dateObject.toLocaleString(); // Includes time
            } else {
                formattedDate = buildDate;
            }
        } catch (e) {
            formattedDate = buildDate;
        }
    } else if (buildDate === "N/A") {
         formattedDate = "N/A";
    }


    return (
        <div className="text-xs opacity-35 font-mono">
            <p>Version: {version}</p>
            <p>Build: {formattedDate}</p>
        </div>
    );
}