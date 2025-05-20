export default function LogsHistory({ histories }) {
    return (
        <div>
            {/* {histories.length > 0 ? (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">History Logs</h2>
                    <ul className="divide-y">
                        {histories.map((history, idx) => (
                            <li key={idx} className="py-2">
                                <div className="text-sm text-gray-700">
                                    <strong>
                                        {history.user?.name ?? "Unknown User"}
                                    </strong>{" "}
                                    performed <strong>{history.action}</strong>
                                </div>
                                <div className="text-xs text-gray-500">
                                    {new Date(
                                        history.created_at
                                    ).toLocaleString()}
                                </div>
                                <pre className="text-xs bg-gray-100 p-2 mt-1 rounded text-gray-800 overflow-x-auto">
                                    {JSON.stringify(history.changes, null, 2)}
                                </pre>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="text-sm text-gray-500 mt-6">
                    No history records available.
                </p>
            )} */}

            <h1>Audit Log - All Histories</h1>
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Action</th>
                        <th>Model</th>
                        <th>Model ID</th>
                        <th>Changes</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {histories.data.map((history) => (
                        <tr key={history.id}>
                            <td>{history.user_id}</td>{" "}
                            {/* Optionally resolve user name if you eager load */}
                            <td>{history.action}</td>
                            <td>{history.model_type}</td>
                            <td>{history.model_id}</td>
                            <td>
                                <pre>
                                    {JSON.stringify(history.changes, null, 2)}
                                </pre>
                            </td>
                            <td>
                                {new Date(history.created_at).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination controls */}
            <div>
                {histories.prev_page_url && (
                    <a href={histories.prev_page_url}>Previous</a>
                )}
                {histories.next_page_url && (
                    <a href={histories.next_page_url}>Next</a>
                )}
            </div>
        </div>
    );
}
