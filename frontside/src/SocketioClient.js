import React, { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { POST_TYPES } from "./redux/actions/postActions";
import { NOTIFY_TYPES } from "./redux/actions/notifyActions";
import { MESS_TYPE } from "./redux/actions/messageActions";
import { SocketContext } from './SocketContext'; // Import the SocketContext

const SocketioClient = () => {
    const { auth } = useSelector(state => state);
    const dispatch = useDispatch();
    const socket = useContext(SocketContext); // Access the socket from the context

    useEffect(() => {
        if (socket && auth?.user?._id) {
            socket.connect(); // Connect only after auth and socket exist
            socket.emit('joinUser', auth.user._id);
        }
        return () => {
            if (socket) {
                socket.off('joinUser');
                socket.disconnect();
            }
        };
    }, [socket, auth?.user?._id]);

    useEffect(() => {
        if (socket) {
            socket.on('likeToClient', newPost => {
                dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
            });
            return () => socket.off('likeToClient');
        }
    }, [socket, dispatch]);

    useEffect(() => {
        if (socket) {
            socket.on('unlikeToClient', newPost => {
                dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
            });
            return () => socket.off('unlikeToClient');
        }
    }, [socket, dispatch]);

    useEffect(() => {
        if (socket) {
            socket.on('createCommentToClient', newPost => {
                dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
            });
            return () => socket.off('createCommentToClient');
        }
    }, [socket, dispatch]);

    useEffect(() => {
        if (socket) {
            socket.on('deleteCommentToClient', newPost => {
                dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
            });
            return () => socket.off('deleteCommentToClient');
        }
    }, [socket, dispatch]);

    useEffect(() => {
        if (socket) {
            socket.on('addfriendToClient', newUser => {
                dispatch({ type: 'AUTH', payload: { ...auth, user: newUser } });
            });
            return () => socket.off('addfriendToClient');
        }
    }, [socket, dispatch, auth]);

    useEffect(() => {
        if (socket) {
            socket.on('unfriendToClient', newUser => {
                dispatch({ type: 'AUTH', payload: { ...auth, user: newUser } });
            });
            return () => socket.off('unfriendToClient');
        }
    }, [socket, dispatch, auth]);

    useEffect(() => {
        if (socket) {
            socket.on('createNotifyToClient', msg => {
                dispatch({ type: NOTIFY_TYPES.CREATE_NOTIFIES, payload: msg });
            });
            return () => socket.off('createNotifyToClient');
        }
    }, [socket, dispatch]);

    useEffect(() => {
        if (socket) {
            socket.on('removeNotifyToClient', msg => {
                dispatch({ type: NOTIFY_TYPES.REMOVE_NOTIFIES, payload: msg });
            });
            return () => socket.off('removeNotifyToClient');
        }
    }, [socket, dispatch]);

    useEffect(() => {
        if (socket) {
            socket.on('addMessageToclient', msg => {
                dispatch({ type: MESS_TYPE.ADD_MESSAGE, payload: msg });
            });
            return () => socket.off('addMessageToclient');
        }
    }, [socket, dispatch]);

    return <></>;
};

export default SocketioClient;
