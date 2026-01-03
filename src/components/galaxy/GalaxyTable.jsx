import React from 'react';
import './GalaxyTable.css';

const GalaxyTable = ({ columns = [], data = [], keyField = "id" }) => {
    return (
        <div className="galaxy-table-container">
            <table className="galaxy-table">
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index}>{col.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row[keyField]}>
                            {columns.map((col, colIndex) => (
                                <td key={colIndex}>
                                    {col.render ? col.render(row) : row[col.field]}
                                </td>
                            ))}
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={columns.length} className="text-center py-8 text-neutral-400">
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default GalaxyTable;
