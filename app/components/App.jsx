import React from 'react';
import Notes from './Notes';
import uuid from 'uuid';

export default class App extends React.Component {

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

    render() {
        const {notes} = this.state;

        return (
            <div>
                <button onClick={this.addNote}> + </button>
                <Notes notes={notes}
                       onDelete={this.deleteNote}
                />
            </div>
        )
    }
}

