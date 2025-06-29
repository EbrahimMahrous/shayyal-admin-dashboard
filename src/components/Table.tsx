import styles from "../styles/Components/Table.module.css";

interface TableSectionProps {
  title: string;
  columns: string[];
  data: any[];
}

const Table = ({ title, columns, data }: TableSectionProps) => {
  return (
    <div className={styles.tableSection}>
      <h3>{title}</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {Object.values(row).map((val, i) => (
                  <td key={i}>{val as React.ReactNode}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
};

export default Table;
