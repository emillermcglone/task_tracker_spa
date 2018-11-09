import React from 'react';
import ReactDOM from 'react-dom';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
import _ from 'lodash';
import $ from 'jquery';

// import Header from './header';
//import TaskList from './task_list';
import UserList from './user_list';

export default function root_init(node) {
    let tasks = window.tasks;
    ReactDOM.render(<Root tasks={tasks} />, node);
}

class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: props.tasks,
            users: [],
            session: null,
            isNewUser: false,
            userEmail: "",
            userPassword: "",
            newUser: { email: "", password_hash: "" },
            newTask: { title: "", description: "", completed: false, time: 0, user_id: 0 }
        };
        this.fetch_tasks();
        this.fetch_users();
    }

    fetch_tasks() {
        $.ajax("/api/v1/tasks", {
            method: "get",
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            data: "",
            success: (resp) => {
                let state1 = _.assign({}, this.state, { tasks: resp.data });
                this.setState(state1);
            },
        });
    }

    fetch_users() {
        $.ajax("/api/v1/users", {
            method: "get",
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            data: "",
            success: (resp) => {
                let state1 = _.assign({}, this.state, { users: resp.data });
                this.setState(state1);
            },
        });
    }

    create_session(email, password) {
        $.ajax("/api/v1/sessions", {
            method: "post",
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify({ email, password }),
            success: (resp) => {
                let state1 = _.assign({}, this.state, { session: resp.data });
                this.setState(state1);
            }
        });
    }

    end_session() {
        let state1 = _.assign({}, this.state, { session: null });
        this.setState(state1);
    }

    login() {
        $.ajax("/api/v1/users", {
            method: "post",
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify({ user: this.state.newUser }),
            success: (resp) => {
                let state1 = _.assign({}, this.state, { isNewUser: false });
                this.setState(state1);
            }
        });
    }

    cancel_login() {
        let state1 = _.assign({}, this.state, { isNewUser: false });
        this.setState(state1);
    }

    logging_in() {
        let state1 = _.assign({}, this.state, { isNewUser: true });
        this.setState(state1);
    }

    create_task() {
        $.ajax("/api/v1/tasks", {
            method: "post",
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify(this.state.newTask),
            success: (resp) => {
                let newTask1 = { title: "", description: "", completed: false, time: 0, user_id: 0 };
                let tasks1 = _.concat(this.state.tasks, [resp.data]);
                let state1 = _.assign({}, this.state, { tasks: tasks1, newTask: newTask1 });
                this.setState(state1);
            }
        });
    }

    edit_task(task_id) {
        let task = this.get_task(task_id);
        $.ajax("/api/v1/tasks/" + task_id, {
            method: "put",
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify({ id: task_id, task: task }),
            success: (resp) => {
                let tasks1 = this.state.tasks;
                _.map(tasks1, (tt) => {
                    return tt.id == resp.data.id ? resp.data : tt;
                })
                let state1 = _.assign({}, this.state, { tasks: tasks1 });
                this.setState(state1);
            }
        });
    }

    get_task(task_id) {
        let tasks1 = this.state.tasks;
        let task1 = null;
        _.map(tasks1, (tt) => {
            if (tt.id == task_id) {
                task1 = tt;
            }
        });
        return task1;
    }

    delete_task(task_id) {
        $.ajax("/api/v1/tasks/" + task_id, {
            method: "delete",
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify({ task: this.state.newTask }),
            success: () => {
                let tasks1 = _.filter(this.state.tasks, (tt) => tt.id != task_id);
                let state1 = _.assign({}, this.state, { tasks: tasks1 });
                this.setState(state1);

            }
        });
    }

    new_title(title) {
        let task1 = this.state.newTask;
        task1.title = title;
        let state1 = _.assign({}, this.state, { newTask: task1 });
        this.setState(state1);
    }

    new_description(description) {
        let task1 = this.state.newTask;
        task1.description = description;
        let state1 = _.assign({}, this.state, { newTask: task1 });
        this.setState(state1);
    }

    new_assigned_user(user_id) {
        let task1 = this.state.newTask;
        task1.user_id = user_id;
        let state1 = _.assign({}, this.state, { newTask: task1 });
        this.setState(state1);
    }

    update_task(task_id, task) {
        let stateTasks = this.state.tasks;
        let newTasks = _.map(stateTasks, (tt) => {
            return tt.id == task_id ? task : tt;
        })
        let state1 = _.assign({}, this.state, { tasks: newTasks });
        this.setState(state1);
    }

    update_assigned_user(task_id, user_id) {
        let task1 = this.getTask(task_id);
        task1.user_id = parseInt(user_id);
        this.updateTask(task_id, task1);
    }

    mark_complete(task_id) {
        let task1 = this.getTask(task_id);
        task1.completed = !task.completed;
        this.updateTask(task_id, task1);
    }

    enter_time(task_id, time) {
        let task1 = this.getTask(task_id);
        task1.time = parseInt(time);
        this.updateTask(task_id, task1);
    }
    render() {
        let userEmail = (ev) => {
            let email1 = ev.target.value;
            let state1 = _.assign({}, this.state, { userEmail: email1 });
            this.setState(state1);
        }

        let userPassword = (ev) => {
            let password1 = ev.target.value;
            let state1 = _.assign({}, this.state, { userPassword: password1 });
            this.setState(state1);
        }

        let newUserEmail = (ev) => {
            let newUser = this.state.newUser;
            newUser.email = ev.target.value;
            let state1 = _.assign({}, this.state, { newUser: newUser });
            this.setState(state1);
        }

        let newUserPassword = (ev) => {
            let newUser = this.state.newUser;
            newUser.password_hash = ev.target.value;
            let state1 = _.assign({}, this.state, { newUser: newUser });
            this.setState(state1);
        }

        let login = this.state.isNewUser ?
            <div>
                <h1>Task Tracker</h1>
                <h2>Create Account</h2>
                <div className="form">
                    <input type="email" placeholder="email" onChange={newUserEmail} />
                    <input type="password" placeholder="password" onChange={newUserPassword} />
                    <button className="btn btn-primary" onClick={() => this.login(this.state.newUser.email, this.state.newUser.password_hash)}>Create Account</button>
                </div>
                <button className="btn btn-primary" onClick={() => this.cancel_login()}>Back</button>
            </div>
            :
            <div>
                <h1>Task Tracker</h1>
                <h2>Login</h2>
                <div className="form-inline my-2">
                    <input type="email" placeholder="email" onChange={userEmail} />
                    <input type="password" placeholder="password" onChange={userPassword} />
                    <button className="btn btn-primary" onClick={() => this.create_session(this.state.userEmail, this.state.userPassword)}>Login</button>
                </div>
                <button className="btn btn-primary" onClick={this.logging_in.bind(this)}>Create Account</button>
            </div>;
        let display = this.state.session ?
            <div>
                <Router>
                    <div>
                        <Header root={this} />
                        <Route path="/" exact={true} render={() =>
                            <TaskList tasks={this.state.tasks} root={this} />
                        } />
                        <Route path="/users" exact={true} render={() =>
                            <UserList users={this.state.users} root={this} />
                        } />
                    </div>
                </Router>
            </div>
            :
            <Router>
                {login}
            </Router>;

        return display
    }
}

function Header(props) {
    let { root } = props;
    function fetch_users() {
        root.fetch_users();
    }

    return <div className="row my-2">
        <div className="col-4">
            <h1><Link to={"/"}>Task Tracker</Link></h1>
        </div>
        <div className="col-2">
            <p><Link to={"/users"} onClick={fetch_users}>Users</Link></p>
        </div>
        <div className="col-md-6">
            <button className="btn btn-primary" onClick={() => root.end_session()}>Log out</button>
        </div>
    </div>;
}

function TaskList(props) {

    let newTask = props.newTask;

    let newTitle = (ev) => {
        props.root.new_title(ev.target.value);
    };

    let newDescription = (ev) => {
        props.root.new_description(ev.target.value);
    };

    let newAssignedUser = (ev) => {
        props.root.new_assigned_user(ev.target.value);
    };

    let userOption = (user) => {
        return <option key={user.id} value={user.id}>{user.email}</option>;
    };

    let tasks = _.map(props.tasks, (tt) => <Task key={tt.id} task={tt} users={props.users} userOption={userOption} root={props.root} />);
    return <div>

        <div className="card">
            <h2 className="card-header">New Task</h2>
            <div className="card-body">
                <form>
                    <div className="form-group">
                        <label>Title</label>
                        <input type="text" className="form-control" id="title" onChange={newTitle} />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <input type="text" className="form-control" id="description" onChange={newDescription} />
                    </div>
                    <div className="form-group">
                        <label>Assigned To</label>
                        <select type="text" className="form-control" id="newAssignedUser" onChange={newAssignedUser}>
                        </select>
                    </div>
                </form>
                <button className="btn btn-primary" onClick={() => props.root.create_task()}>Create Task</button>
            </div>
        </div>


        <br />
        <div className="row">
            {tasks}
        </div>
    </div >;
}

function Task(props) {
    let { root, task } = props;

    let updateTime = (ev) => {
        root.enter_time(task.id, ev.target.value);
    };

    let updateComplete = (ev) => {
        root.mark_complete(task.id);
    };

    let updateAssignedUser = (ev) => {
        root.update_assigned_user(task.id, ev.target.value);
    };

    return <div className="card col-4">
        <div className="card-body">
            <h2 className="card-title">{task.title}</h2>
            <p className="card-text">Description: {task.description}<br />
                Assigned To: {task.id}<br />
                Completed: {task.completed}<br />
                Time Spent: {task.time}</p><br />
            <form>

                <div className="form-group">
                    <label>Assign to</label>
                    <select className="form-control" id="reassign" onChange={updateAssignedUser}>
                    </select>
                </div>
                <div className="form-group">
                    <label>Complete</label>
                    <select className="form-control" id="complete" onChange={updateComplete}>
                    </select>
                </div>
                <div className="form-group">
                    <label>Enter Time:</label>
                    <input className="form-control" id="time" onChange={updateTime} />
                </div>
            </form>
            <button className="btn btn-primary" onClick={() => props.root.update_task()}>Update Task</button>
        </div>
    </div>;
}
