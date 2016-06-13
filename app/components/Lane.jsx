import React from 'react';

import {compose} from 'redux';
import {DropTarget} from 'react-dnd';
import ItemTypes from '../constants/itemTypes';

import connect from '../libs/connect';
import Notes from './Notes';
import NoteActions from '../actions/NoteActions';
import LaneActions from '../actions/LaneActions';

import LaneHeader from './LaneHeader';

const Lane = ({
    connectDropTarget,
    lane, notes, LaneActions, NoteActions, ...props
    }) => {

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

    return connectDropTarget(
        <div {...props}>
            <LaneHeader lane={lane}/>
            <Notes notes={selectNotesByIds(notes, lane.notes)}
                   onNoteClick={activateNoteEdit}
                   onEdit={editNote}
                   onDelete={deleteNote}
            />
        </div>
    );
};

const noteTarget = {
    hover(targetProps, monitor) {
        const sourceProps = monitor.getItem();
        const sourceId = sourceProps.id;

        // If the target lane doesn't have notes,
        // attach the note to it.
        //
        // `attachToLane` performs necessarly
        // cleanup by default and it guarantees
        // a note can belong only to a single lane
        // at a time.
        if(!targetProps.lane.notes.length) {
            LaneActions.attachToLane({
                laneId: targetProps.lane.id,
                noteId: sourceId
            });
        }
    }
};


function selectNotesByIds(allNotes, noteIds = []) {
    return noteIds.reduce((notes, id) =>
        notes.concat(
            allNotes.filter(note => note.id === id)
        )
        , []);
}


export default compose(
    DropTarget(ItemTypes.NOTE, noteTarget, connect => ({
        connectDropTarget: connect.dropTarget()
    })),
    connect(({notes}) => ({
        notes
    }), {
        NoteActions,
        LaneActions
    })
)(Lane)

