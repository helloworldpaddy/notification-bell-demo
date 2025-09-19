import React from 'react';
import './DataTable.css';

const DataTable = () => {
  // Sample dummy data
  const sampleTasks = [
    { id: 1, title: 'Implement user authentication', status: 'In Progress', assignee: 'John Doe', dueDate: '2024-01-15' },
    { id: 2, title: 'Fix navigation bug', status: 'Completed', assignee: 'Jane Smith', dueDate: '2024-01-10' },
    { id: 3, title: 'Update database schema', status: 'Pending', assignee: 'Bob Johnson', dueDate: '2024-01-20' },
    { id: 4, title: 'Write API documentation', status: 'In Progress', assignee: 'Alice Brown', dueDate: '2024-01-18' },
    { id: 5, title: 'Deploy to production', status: 'Pending', assignee: 'Charlie Wilson', dueDate: '2024-01-25' },
    { id: 6, title: 'Code review for feature X', status: 'Completed', assignee: 'David Lee', dueDate: '2024-01-12' },
    { id: 7, title: 'Setup CI/CD pipeline', status: 'In Progress', assignee: 'Eva Martinez', dueDate: '2024-01-22' },
    { id: 8, title: 'Performance optimization', status: 'Pending', assignee: 'Frank Taylor', dueDate: '2024-01-30' },
  ];

  const getStatusBadge = (status) => {
    const statusClass = status.toLowerCase().replace(' ', '-');
    return <span className={`status-badge ${statusClass}`}>{status}</span>;
  };

  return (
    <div className="data-table-container">
      <h2>Task Management</h2>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Task ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Assignee</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {sampleTasks.map((task) => (
              <tr key={task.id}>
                <td>#{task.id}</td>
                <td>{task.title}</td>
                <td>{getStatusBadge(task.status)}</td>
                <td>{task.assignee}</td>
                <td>{task.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
