import React from 'react';
import Notes from './Notes';
import uuid from 'uuid';

import connect from '../libs/connect';

class App extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            notes: [
                {
                    id: uuid.v4(),
                    task: 'Learn React'
                },
                {
                    id: uuid.v4(),
                    task: 'Do laundry'
                }
            ]
        }
    }

    addNote = () => {
        this.setState({
            notes: this.state.notes.concat([{
                id: uuid.v4(),
                task: 'New Task'
            }])
        });
    }

    deleteNote = (id, e) => {
        /**
         *  1) App --- onDelete -> Notes --- onDelete.bind(null,id) ---> Note
         *
         *  2) Note --- onDelete(id, e) ---> Notes --- onDelete(id, e) ---> App
         */
        e.stopPropagation();

        this.setState({
            notes: this.state.notes.filter(note => note.id !== id)
        });
    }

    activateNoteEdit = (id) => {
        this.setState({
            notes: this.state.notes.map(note => {
                if(note.id === id){
                    note.editing = true;
                }
                return note;
            })
        });
    }

    editNote = (id, task) => {
        this.setState({
            notes: this.state.notes.map(note => {
                if(note.id === id) {
                    note.editing = false;
                    note.task = task;
                }
                return note;
            })
        });
    }

    render() {
        const {notes} = this.state;

        return (
            <div>
                {this.props.test}
                <button className="add-note" onClick={this.addNote}> + </button>
                <Notes notes={notes}
                       onNoteClick={this.activateNoteEdit}
                       onEdit={this.editNote}
                       onDelete={this.deleteNote}
                />
            </div>
        )
    }
}

export default connect(() => ({
    test: 'test'
}))(App)

