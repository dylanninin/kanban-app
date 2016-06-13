import React from 'react';
import uuid from 'uuid';
import connect from '../libs/connect';
import Notes from './Notes';
import NoteActions from '../actions/NoteActions';
import LaneActions from '../actions/LaneActions';

const Lane = ({
    lane, notes, LaneActions, NoteActions, ...props
    }) => {

    const addNote = e => {
        e.stopPropagation();

        const noteId = uuid.v4();

        NoteActions.create({
            id: noteId,
            task: 'New Task'
        });

        LaneActions.attachToLane({
            laneId: lane.id,
            noteId
        });
    };

    const deleteNote = (noteId, e) => {
        /**
         *  1) App --- onDelete -> Notes --- onDelete.bind(null,id) ---> Note
         *
         *  2) Note --- onDelete(id, e) ---> Notes --- onDelete(id, e) ---> App
         */
        e.stopPropagation();

        NoteActions.delete(noteId);

        LaneActions.detachFromLane({
            laneId: lane.id,
            noteId
        });

    };

    const activateNoteEdit = (id) => {
        NoteActions.update({id, editing: true});
    };

    const editNote = (id, task) => {
        NoteActions.update({id, task, editing: false});
    };

    return (
        <div {...props}>
            <div className="lane-header">
                <div className="lane-add-note">
                    <button className="add-note" onClick={addNote}> +</button>
                </div>
                <div className="lane-name">{lane.name}</div>
            </div>
            <Notes notes={selectNotesByIds(notes, lane.notes)}
                   onNoteClick={activateNoteEdit}
                   onEdit={editNote}
                   onDelete={deleteNote}
            />
        </div>
    );
};

function selectNotesByIds(allNotes, noteIds = []) {
    return noteIds.reduce((notes, id) =>
        notes.concat(
            allNotes.filter(note => note.id === id)
        )
        , []);
}

export default connect(
    ({notes}) => ({
        notes
    }), {
        NoteActions,
        LaneActions
    }
)(Lane)
