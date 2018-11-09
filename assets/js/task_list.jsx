import React from 'react';
import _ from 'lodash';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';

export default function TaskList(props) {
    let tasks = _.map(props.tasks, (tt) => <Task key={tt.id} task={tt} />);
    return <div className="row">
        {tasks}
    </div>;
}

function Task(props) {
    let { task } = props;
    return <div className="card col-4">
        <div className="card-body">
            <h2 className="card-title"><Link to={"/tasks/" + task.id}>{task.title}</Link></h2>
            <p className="card-text">{task.description} <br />
                Assigned To: {task.id}<br />
                Completed: {task.completed}<br />
                Time Spent: {task.time}<br /></p>
        </div>
    </div>;
}